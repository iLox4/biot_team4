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
      this.code = `${Add.UC_CODE}gatewayDaoGetByUuIdentityFailed`;
      this.message = "Get gateway by gateway DAO getByUuIdentity failed.";
    }
  },
  GatewayNotFound: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}gatewayNotFound`;
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
      this.code = `${Remove.UC_CODE}recordDaoGetFailed`;
      this.message = "Get record by record DAO get failed.";
    }
  },
  RecordNotFound: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}recordNotFound`;
      this.message = "Records with provided ID's do not exist.";
    }
  },
  RecordDaoRemoveFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}recordDaoRemoveFailed`;
      this.message = "Remove record by record DAO remove failed.";
    }
  },
};

const GetInterval = {
  UC_CODE: `${RECORD_ERROR_PREFIX}getInterval/`,
  InvalidDtoIn: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetInterval.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  RecordDaoGetIntervalFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetInterval.UC_CODE}RecordDaoGetIntervalFailed`;
      this.message = "Get records by record DAO get failed.";
    }
  },
};

const RemoveOld = {
  UC_CODE: `${RECORD_ERROR_PREFIX}removeOld/`,
  InvalidDtoIn: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetInterval.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  RecordDaoGetIntervalFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetInterval.UC_CODE}RecordDaoGetIntervalFailed`;
      this.message = "Get records by record DAO get failed.";
    }
  },
  GatewayDaoListFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetInterval.UC_CODE}GatewayDaoListFailed`;
      this.message = "List gateways by record DAO removeOld failed.";
    }
  },
  RecordDaoRemoveFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetInterval.UC_CODE}RecordDaoRemoveFailed`;
      this.message = "Remove record by record DAO removeOld failed.";
    }
  },
  RecordDaoCreateFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}RecordDaoCreateFailed`;
      this.message = "Add record by record DAO removeOld failed.";
    }
  },
};

module.exports = {
  Remove,
  Add,
  GetInterval,
  RemoveOld
};
