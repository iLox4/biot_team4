"use strict";
const Team4MainAbl = require("../../abl/team4-main-abl.js");

class Team4MainController {
  init(ucEnv) {
    return Team4MainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new Team4MainController();
