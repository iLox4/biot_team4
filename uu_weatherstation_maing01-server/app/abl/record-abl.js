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

    let dtoOut;
    try {
      dtoOut = await this.recordDao.getInterval(awid, dtoIn.gatewayId, dtoIn.startDate, dtoIn.endDate);
    } catch (e) {
      throw new Error.GetInterval.RecordDaoGetIntervalFailed({ uuAppErrorMap }, e);
    }

    const granularityConvertor = {
      "1m": 1,
      "5m": 5,
      "15m": 15,
      "30m": 30,
      "1h": 60,
      "12h": 720,
      "1d": 1440,
    };
    
    let newItemList = [];
    const granularity = granularityConvertor[dtoIn.granularity];

    if (dtoOut["itemList"]) {
      dtoOut["itemList"].forEach((record, idx) => {
        if (idx === 0) {
          newItemList.push({
            temperature: record.temperature,
            humidity: record.humidity,
            datetime: new Date(record.datetime),
          });
        } else {
          let startInterval = newItemList[newItemList.length - 1];
          let endInterval = record;

          if (new Date(endInterval.datetime) > new Date(startInterval.datetime)) {
            let timeDiff = (new Date(endInterval.datetime) - new Date(startInterval.datetime)) / 60000;

            if (timeDiff > granularity) {
              let changeMod = Math.round(timeDiff / granularity);
              let temp_change = (endInterval.temperature - startInterval.temperature) / changeMod;
              let hum_change = (endInterval.humidity - startInterval.humidity) / changeMod;

              for (let i = 1; i <= timeDiff / granularity; i++) {
                newItemList.push({
                  temperature: Math.round(startInterval.temperature + temp_change * i),
                  humidity: Math.round(startInterval.humidity + hum_change * i),
                  datetime: new Date(new Date(startInterval.datetime).getTime() + granularity * 60000 * i),
                });
              }

            } else if (timeDiff < granularity) {
              let numRecords = 1,
                sumTemp = startInterval.temperature,
                sumHum = startInterval.humidity;
              let newEnd = endInterval;
              let i = idx;

              while (timeDiff < granularity && i < dtoOut["itemList"].length) {
                numRecords++;
                sumTemp += newEnd.temperature;
                sumHum += newEnd.humidity;
                i++;

                newEnd = dtoOut["itemList"][i];
                timeDiff = (new Date(newEnd) - new Date(startInterval.datetime)) / 60000;
              }

              let avgTemp = Math.round(sumTemp / numRecords);
              let avgHum = Math.round(sumHum / numRecords);

              newItemList.push({
                temperature: avgTemp,
                humidity: avgHum,
                datetime: new Date(new Date(startInterval.datetime).getTime() + granularity * 60000),
              });
            } else {
              newItemList.push({
                temperature: endInterval.temperature,
                humidity: endInterval.humidity,
                datetime: new Date(endInterval.datetime),
              });
            }
          }
        }
      });
    }

    dtoOut["itemList"] = newItemList;
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    dtoOut.pageInfo.total = newItemList.length;
    return dtoOut;
  }
}

module.exports = new RecordAbl();
