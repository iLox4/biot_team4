"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const ObjectID = require("bson-objectid");

class RecordMongo extends UuObjectDao {
  async createSchema() {}

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async getLastByGatewayId(awid, gatewayId) {
    return await super.find({ awid, gatewayId }).sort({ datetime: -1 }).limit(1);
  }

  async remove(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.deleteOne(filter);
  }

  async getInterval(awid, gatewayId, startDate, endDate) {
    let filter = {
      gatewayId: ObjectID(gatewayId),
      awid: awid,
      datetime: { $gte: startDate },
      datetime: { $lte: endDate },
    };

    return await super.find(filter, {datetime: 1});
  }
}

module.exports = RecordMongo;
