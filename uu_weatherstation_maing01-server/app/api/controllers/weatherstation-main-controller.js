"use strict";
const WeatherstationMainAbl = require("../../abl/weatherstation-main-abl.js");

class WeatherstationMainController {
  init(ucEnv) {
    return WeatherstationMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return WeatherstationMainAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return WeatherstationMainAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new WeatherstationMainController();
