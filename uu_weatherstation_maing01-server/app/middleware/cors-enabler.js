"use strict";

const cors = require("cors");

const MIDDLEWARE_ORDER = -10;

class CorsEnabler {
  constructor() {
    this.order = MIDDLEWARE_ORDER;
    this.profiles = "test,development"; // cors configuration will be applied only in development environment
  }

  get pre() {
    const corsOptions = {
      origin: true,
      optionsSuccessStatus: 200,
      credentials: true,
      exposedHeaders: ["X-Ues-Error", "Etag", "X-Request-Id", "Www-Authenticate", "Content-Disposition"],
    };

    return [cors(corsOptions)];
  }
}

module.exports = CorsEnabler;
