"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/gateway-error.js");

const UnsupportedKeysWarning = (error) => {
  return `${error?.UC_CODE}unsupportedKeys`;
};

const defaultPageInfo = {
  pageSize: 20,
  pageIndex: 0,
}

class GatewayAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "gateway-types.js"));
    this.gatewayDao = DaoFactory.getDao("gateway");
    this.recordDao = DaoFactory.getDao("record");
    this.gatewayDao.createSchema();
  }

  async getRecords(awid, dtoIn) {
    // TODO: getRecords
  }

  async remove(awid, dtoIn) {
    let validationResult = this.validator.validate("removeGatewayDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Remove),
      Errors.Remove.InvalidDtoIn
    );

    let gateway;
    try {
      gateway = await this.gatewayDao.get(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Remove.GatewayDaoGetFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    if (!gateway) throw new Errors.Remove.GatewayNotFound({ uuAppErrorMap });
    if (gateway.state !== 'closed') throw new Errors.Remove.WrongGatewayState({ uuAppErrorMap });

    try {
      await this.gatewayDao.remove(gateway);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Remove.GatewayDaoRemoveFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    const dtoOut = gateway;
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("listGatewayDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.List),
      Errors.List.InvalidDtoIn
    );

    const userProfiles = authorizationResult.getAuthorizedProfiles();
    const isAdmin = userProfiles.includes("Administrators");

    const pageInfo = {...defaultPageInfo, ...dtoIn.pageInfo}

    let dtoOut;
    try {
      const itemList = await this.gatewayDao.list(
        awid,
        {
          name: dtoIn.name,
          location: dtoIn.location,
          state: isAdmin ? dtoIn.state : "active",
        },
        pageInfo
      );
      const itemCount = await this.gatewayDao.count( awid, {
        name: dtoIn.name,
        location: dtoIn.location,
        state: isAdmin ? dtoIn.state : "active",
      });
      dtoOut = {
        itemList,
        pageInfo: {
          ...pageInfo,
          total: itemCount,
        }
      };
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.List.GatewayDaoListFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async get(awid, dtoIn) {
    let validationResult = this.validator.validate("getGatewayDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Get),
      Errors.Get.InvalidDtoIn
    );

    let dtoOut;
    try {
      dtoOut = await this.gatewayDao.get(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Get.GatewayDaoGetFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    if (!dtoOut) throw new Errors.Get.GatewayNotFound({ uuAppErrorMap });

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn) {
    let validationResult = this.validator.validate("updateGatewayDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Update),
      Errors.Update.InvalidDtoIn
    );

    let gateway;
    try {
      gateway = await this.gatewayDao.get(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.GatewayDaoGetFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    if (!gateway) throw new Errors.Update.GatewayNotFound({ uuAppErrorMap });

    const updatedGateway = gateway = { 
      ...gateway, 
      ...dtoIn,
      location: {
        ...gateway.location,
        ...dtoIn.location,
      }
    };

    let dtoOut;
    try {
      dtoOut = await this.gatewayDao.update(updatedGateway);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.GatewayDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async register(awid, dtoIn, session) {
    const uuAppErrorMap = {};
    const uuIdentity = session.getIdentity().getUuIdentity();

    // Check if Gateway is not registered yet
    let gateway;
    try {
      gateway = await this.gatewayDao.getByUuIdentity(awid, uuIdentity);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Register.GatewayDaoGetByUuIdentityFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    if (gateway) {
      const dtoOut = gateway;
      dtoOut.uuAppErrorMap = uuAppErrorMap;
      return dtoOut;
    }

    // Regsiter new Gateway
    let dtoOut;
    try {
      dtoOut = await this.gatewayDao.create({
        awid,
        uuIdentity,
        name: `Gateway ${uuIdentity}`,
        location: {
          city: null,
          street: null,
          zip: null,
        },
        state: "created",
      });
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Register.GatewayDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new GatewayAbl();
