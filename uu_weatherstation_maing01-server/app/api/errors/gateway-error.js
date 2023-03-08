"use strict";

const WeatherstationMainUseCaseError = require("./weatherstation-main-use-case-error.js");
const GATEWAY_ERROR_PREFIX = `${WeatherstationMainUseCaseError.ERROR_PREFIX}gateway/`;

const Register = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}register/`,
  GatewayDaoCreateFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Register.UC_CODE}gatewayDaoCreateFailed`;
      this.message = "Register gateway by gateway DAO create failed.";
    }
  },
  GatewayDaoGetByUuIdentityFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Register.UC_CODE}GatewayDaoGetByUuIdentityFailed`;
      this.message = "Get gateway by gateway DAO getByUuIdentity failed.";
    }
  },
};

const Update = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}update/`,
  InvalidDtoIn: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  GatewayDaoGetFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}GatewayDaoGetFailed`;
      this.message = "Get gateway by gateway DAO get failed.";
    }
  },
  GatewayDaoUpdateFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}GatewayDaoUpdateFailed`;
      this.message = "Update gateway by gateway DAO update failed.";
    }
  },
  GatewayNotFound: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}GatewayNotFound`;
      this.message = "Gateway with provided ID does not exist.";
    }
  },
};

const Get = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}get/`,
  InvalidDtoIn: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  GatewayDaoGetFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}GatewayDaoGetFailed`;
      this.message = "Get gateway by gateway DAO get failed.";
    }
  },
  GatewayNotFound: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}GatewayNotFound`;
      this.message = "Gateway with provided ID does not exist.";
    }
  },
};

const List = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}list/`,
  InvalidDtoIn: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  GatewayDaoListFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}GatewayDaoListFailed`;
      this.message = "List gateway by gateway DAO list failed.";
    }
  },
};

const Remove = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}remove/`,
  InvalidDtoIn: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  GatewayDaoGetFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}GatewayDaoGetFailed`;
      this.message = "Get gateway by gateway DAO get failed.";
    }
  },
  GatewayDaoRemoveFailed: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}GatewayDaoRemoveFailed`;
      this.message = "Remove gateway by gateway DAO remove failed.";
    }
  },
  GatewayNotFound: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}GatewayNotFound`;
      this.message = "Gateway with provided ID does not exist.";
    }
  },
  WrongGatewayState: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}WrongGatewayState`;
      this.message = "Gateway must be in 'closed' state to be removed.";
    }
  },
};

const GetRecords = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}getRecords/`,
  InvalidDtoIn: class extends WeatherstationMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetRecords.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

module.exports = {
  GetRecords,
  Remove,
  List,
  Get,
  Update,
  Register
};
