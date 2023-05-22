"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/record-error.js");
const { sampleRecordsData, inTimeInterval } = require("../utils/recordsDataUtils");
const { getGranularityInterval, validateGranularity, getSafeTimeInterval, olderRecordsGranularities } = require("../utils/granularityUtils");
const { log } = require("console");

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
    await Promise.all(
      dtoIn.ids.map(async (id) => {
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
      })
    );
    if (notExistingRecordsIds.length > 0)
      throw new Errors.Remove.RecordNotFound({ uuAppErrorMap }, { notFoundIds: notExistingRecordsIds });

    let dtoOut;
    try {
      await Promise.all(dtoIn.ids.map((id) => this.recordDao.remove(awid, id)));
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
      await Promise.all(dtoIn.map((record) => this.recordDao.create({ ...record, gatewayId: gateway.id, awid })));
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

  async getInterval(awid, dtoIn) {
    let validationResult = this.validator.validate("getRecordsIntervalDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.GetInterval),
      Errors.GetInterval.InvalidDtoIn
    );
    dtoIn.granularity = validateGranularity(dtoIn.granularity, dtoIn.startDate, dtoIn.endDate);
    const granularity = getGranularityInterval(dtoIn.granularity);

    const [safeStart, safeEnd] = getSafeTimeInterval(dtoIn.startDate, dtoIn.endDate);
    const safeStartDate = new Date(safeStart).toISOString();
    const safeEndDate = new Date(safeEnd).toISOString();

    let records;
    try {
      records = await this.recordDao.getInterval(awid, dtoIn.gatewayId, safeStartDate, safeEndDate);
    } catch (e) {
      throw new Errors.GetInterval.RecordDaoGetIntervalFailed({ uuAppErrorMap }, e);
    }

    const recordsListSampled = sampleRecordsData(records.itemList, granularity);
    const recordsList = recordsListSampled.filter(inTimeInterval(dtoIn.startDate, dtoIn.endDate));
    const dataList = recordsList.map((record) => ({
      datetime: record.datetime,
      temperature: record.temperature,
      humidity: record.humidity,
    }));

    const dtoOut = {
      itemList: dataList,
      granularity: dtoIn.granularity,
      uuAppErrorMap,
    };
    return dtoOut;
  }

  async removeOld(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("removeOldRecordDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Remove),
      Errors.RemoveOld.InvalidDtoIn
    );

    let gateways;
    try {
      gateways = await this.gatewayDao.list(awid, {}, { pageSize: 99999, pageIndex: 0 });
    } catch (e) {
      throw new Errors.RemoveOld.GatewayDaoListFailed({ uuAppErrorMap }, e);
    }

    gateways.forEach((gateway) => {
      Object.entries(olderRecordsGranularities).reverse().forEach(async ([interval, granularity], index) => {
        if (interval === 0) return;
        const prev = Object.entries(olderRecordsGranularities).reverse().at(index-1);

        const startDate = index === 0 ? 0 : new Date( Date.now() - prev[0] * 1000 );
        const endDate = new Date( Date.now() - interval * 1000 );

        const [safeStart, safeEnd] = getSafeTimeInterval(startDate, endDate);
        const safeStartDate = new Date(safeStart).toISOString();
        const safeEndDate = new Date(safeEnd).toISOString();

        let recordsOlderThenInterval;
        try {
          recordsOlderThenInterval = await this.recordDao.getInterval(awid, gateway.id, safeStartDate, safeEndDate);
        } catch (e) {
          throw new Errors.RemoveOld.RecordDaoGetIntervalFailed({ uuAppErrorMap }, e);
        }

        const recordsListSampled = sampleRecordsData(recordsOlderThenInterval.itemList, granularity);
        const recordsList = recordsListSampled.filter(inTimeInterval(startDate, endDate));

        // add records with new granularity
        recordsList.forEach(async (recordInNewGranularity) => {
          try {
            await this.recordDao.create({...recordInNewGranularity, awid, gatewayId: gateway.id});
          } catch (e) {
            throw new Errors.RemoveOld.RecordDaoCreateFailed({ uuAppErrorMap }, e);
          }
        })

        // delete old records
        recordsOlderThenInterval.itemList.forEach(async (record) => {
          try {
            await this.recordDao.remove(awid, record.id);
          } catch (e) {
            throw new Errors.RemoveOld.RecordDaoRemoveFailed({ uuAppErrorMap }, e);
          }
        })
      })
    })

    let dtoOut = { status: 'success' };

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new RecordAbl();
