"use strict";
const RecordAbl = require("../../abl/record-abl.js");

class RecordController {

  remove(ucEnv) {
    return RecordAbl.remove(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  add(ucEnv) {
    return RecordAbl.add(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  getInterval(ucEnv) {
    return RecordAbl.getInterval(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  removeOld(ucEnv) {
    return RecordAbl.removeOld(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }
}

module.exports = new RecordController();
