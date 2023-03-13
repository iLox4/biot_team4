"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class GatewayMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, uuIdentity: 1 }, { unique: true });
    await super.createIndex({ awid: 1, name: 1, "location.city": 1, "location.street": 1, "location.zip": 1 });
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

  async list(awid, { name, location, state }, pageInfo) {
    const match = { awid };
    if (state) match["state"] = state;
    if (name) match["name"] = { $regex: new RegExp(name, "i") };
    if (location)
      match["$or"] = [
        { "location.city": { $regex: new RegExp(location, "i") } },
        { "location.street": { $regex: new RegExp(location, "i") } },
        { "location.zip": { $regex: new RegExp(location, "i") } },
      ];

    return await super.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: "record",
          let: { gatewayId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$gatewayId", "$$gatewayId"] },
              },
            },
            { $sort: { datetime: -1 } },
            { $limit: 1 },
          ],
          as: "lastRecord",
        },
      },
      {
        $addFields: {
          lastRecord: { $arrayElemAt: ["$lastRecord", 0] },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          location: 1,
          state: 1,
          "lastRecord.temperature": 1,
          "lastRecord.humidity": 1,
          "lastRecord.datetime": 1,
        },
      },
      { $skip: pageInfo.pageSize * pageInfo.pageIndex },
      { $limit: pageInfo.pageSize }
    ]);
  }

  async count(awid, { name, location, state } = {}) {
    const filter = { awid };
    if (state) filter["state"] = state;
    if (name) filter["name"] = { $regex: new RegExp(name, "i") };
    if (location)
      filter["$or"] = [
        { "location.city": { $regex: new RegExp(location, "i") } },
        { "location.street": { $regex: new RegExp(location, "i") } },
        { "location.zip": { $regex: new RegExp(location, "i") } },
      ];

    return await super.count(filter);
  }

  async getByUuIdentity(awid, uuIdentity) {
    let filter = {
      awid: awid,
      uuIdentity: uuIdentity,
    };
    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async remove(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.deleteOne(filter);
  }
}

module.exports = GatewayMongo;
