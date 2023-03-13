"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/record-error.js");

const UnsupportedKeysWarning = (error) => {
  return `${error?.UC_CODE}unsupportedKeys`;
};

class RecordAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "record-types.js"));
    this.recordDao = DaoFactory.getDao("record");
    this.gatewayDao = DaoFactory.getDao("gateway");
    this.recordDao.createSchema();
  }

  async remove(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("removeRecordDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Remove),
      Errors.Remove.InvalidDtoIn
    );

    const notExistingRecordsIds = [];
    await Promise.all(dtoIn.ids.map(async (id) => {
      try {
        const record = await this.recordDao.get(awid, id);
        console.log(record);
        if (!record) notExistingRecordsIds.push(id);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          throw new Errors.Remove.RecordDaoGetFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }));
    if (notExistingRecordsIds.length > 0) throw new Errors.Remove.RecordNotFound({ uuAppErrorMap }, { notFoundIds: notExistingRecordsIds });

    let dtoOut;
    try {
      await Promise.all(dtoIn.ids.map((id) => this.recordDao.remove(awid, id)))
      dtoOut = { removedRecordsIds: dtoIn.ids };
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Remove.RecordDaoRemoveFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async add(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("addRecordDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Add),
      Errors.Add.InvalidDtoIn
    );

    const userId = session.getIdentity().getUuIdentity();

    let gateway;
    try {
      gateway = await this.gatewayDao.getByUuIdentity(awid, userId);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Add.GatewayDaoGetByUuIdentityFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    if (!gateway) throw new Errors.Add.GatewayNotFound({ uuAppErrorMap });
    if (["created", "closed"].includes(gateway.state))
      throw new Errors.Add.InvalidGatewayState({ uuAppErrorMap }, { gatewayState: gateway.state });

    let dtoOut;
    try {
      await Promise.all(dtoIn.map((record) => this.recordDao.create({ ...record, gatewayId: gateway.id, awid })))
      dtoOut = { addedRecordsIds: dtoIn.map((record) => record._id) };
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Add.RecordDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new RecordAbl();
