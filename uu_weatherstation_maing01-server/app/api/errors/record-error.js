"use strict";

const WeatherstationMainUseCaseError = require("./weatherstation-main-use-case-error.js");
const RECORD_ERROR_PREFIX = `${WeatherstationMainUseCaseError.ERROR_PREFIX}record/`;

const Add = {
  UC_CODE: `${RECORD_ERROR_PREFIX}add/`,
  InvalidDtoIn: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  GatewayDaoGetByUuIdentityFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}GatewayDaoGetByUuIdentityFailed`;
      this.message = "Get gateway by gateway DAO getByUuIdentity failed.";
    }
  },
  GatewayNotFound: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}GatewayNotFound`;
      this.message = "Gateway with provided ID does not exist.";
    }
  },
  RecordDaoCreateFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}recordDaoCreateFailed`;
      this.message = "Add record by record DAO create failed.";
    }
  },
  InvalidGatewayState: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}invalidGatewayState`;
      this.message = "Gateway is in invalid state.";
    }
  },
};

const Remove = {
  UC_CODE: `${RECORD_ERROR_PREFIX}remove/`,
  InvalidDtoIn: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  RecordDaoGetFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}RecordDaoGetFailed`;
      this.message = "Get record by record DAO get failed.";
    }
  },
  RecordNotFound: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}RecordNotFound`;
      this.message = "Records with provided ID's do not exist.";
    }
  },
  RecordDaoRemoveFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}RecordDaoRemoveFailed`;
      this.message = "Remove record by record DAO remove failed.";
    }
  },
};

module.exports = {
  Remove,
  Add
};
