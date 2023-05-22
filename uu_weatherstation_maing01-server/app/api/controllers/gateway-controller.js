"use strict";
const GatewayAbl = require("../../abl/gateway-abl.js");

class GatewayController {
  getRecords(ucEnv) {
    return GatewayAbl.getRecords(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
    );
  }

  remove(ucEnv) {
    return GatewayAbl.remove(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
    );
  }

  list(ucEnv) {
    return GatewayAbl.list(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
    );
  }

  get(ucEnv) {
    return GatewayAbl.get(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
    );
  }

  update(ucEnv) {
    return GatewayAbl.update(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
    );
  }

  register(ucEnv) {
    return GatewayAbl.register(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
    );
  }
  lastRecord(ucEnv) {
    return GatewayAbl.lastRecord(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new GatewayController();
