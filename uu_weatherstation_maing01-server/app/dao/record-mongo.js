"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class RecordMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, gatewayId: 1 });
    await super.createIndex({ awid: 1, gatewayId: 1, datetime: 1 });
  }

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
}

module.exports = RecordMongo;
