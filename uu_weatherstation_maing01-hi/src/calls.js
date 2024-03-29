import { Environment } from "uu5g05";
import Plus4U5 from "uu_plus4u5g02";

const CALLS_BASE_URI = (
  (process.env.NODE_ENV !== "production" ? Environment.get("callsBaseUri") : null) || Environment.appBaseUri
).replace(/\/*$/, "/");

const Calls = {
  async call(method, url, dtoIn, clientOptions) {
    const response = await Plus4U5.Utils.AppClient[method](url, dtoIn, clientOptions);
    return response.data;
  },

  loadIdentityProfiles() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/initUve");
    return Calls.call("get", commandUri, {});
  },

  initWorkspace(dtoInData) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/init");
    return Calls.call("post", commandUri, dtoInData);
  },

  getWorkspace() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/get");
    return Calls.call("get", commandUri, {});
  },

  async initAndGetWorkspace(dtoInData) {
    await Calls.initWorkspace(dtoInData);
    return await Calls.getWorkspace();
  },

  Record: {
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("record/getInterval")
      return Calls.call("get", commandUri, dtoIn);
    },
  },

  Gateway: {
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("gateway/list");  
      return Calls.call("get", commandUri, dtoIn);
    },

    get(dtoIn) {
      const commandUri = Calls.getCommandUri("gateway/get");
      return Calls.call("get", commandUri, dtoIn);
    },

    update(dtoIn) {
      const commandUri = Calls.getCommandUri("gateway/update");
      return Calls.call("post", commandUri, dtoIn);
    },

    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("gateway/delete");
      return Calls.call("post", commandUri, dtoIn);
    },

    getLastRecord(dtoIn) {
      const commandUri = Calls.getCommandUri("gateway/lastRecord");
      return Calls.call("get", commandUri, dtoIn);
    }
  },

  Gateways: {
    load(dtoIn) {
      const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/load");
      return Calls.call("get", commandUri, dtoIn);
    },
  },

  getCommandUri(useCase) {
    return CALLS_BASE_URI + useCase.replace(/^\/+/, "");
  },
};

export default Calls;
