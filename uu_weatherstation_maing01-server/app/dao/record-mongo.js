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
      datetime: { $gte: startDate, $lt: endDate },
    };

    return await super.find(filter, {pageIndex: 0, pageSize: 99999}, {datetime: 1});
  }
}

module.exports = RecordMongo;
