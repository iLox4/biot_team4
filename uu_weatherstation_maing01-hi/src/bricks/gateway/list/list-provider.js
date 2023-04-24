//@@viewOn:imports
import { createComponent, useDataList } from "uu5g05";
import Config from "../config/config";
import Calls from "calls";
import Plus4U5 from "uu_plus4u5g02";
//@@viewOff:imports

const ListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const gatewayDataList = useDataList({
      handlerMap: {
        load: handleLoad,
      },
      itemHandlerMap: {
        update: handleUpdate,
        delete: handleDelete,
      },
      pageSize: 50,
    });

    async function handleLoad(dtoIn) {
      //return Calls.Gateway.list(dtoIn);
      const response = await Plus4U5.Utils.AppClient["get"](
        "http://localhost:8080/uu-weatherstation-maing01/22222222222222222222222222222222/gateway/list",
        dtoIn,
        {}
      );
      response.data.itemList = response.data.itemList.map((record) => {
        let newRecord = { ...record, ...record.location };
        delete newRecord.location;
        return newRecord;
      });

      return { itemList: response.data.itemList, pageInfo: response.data.pageInfo };
    }

    async function handleUpdate(dtoIn, lastRecord) {
      const response = await Plus4U5.Utils.AppClient["post"](
        "http://localhost:8080/uu-weatherstation-maing01/22222222222222222222222222222222/gateway/update",
        dtoIn,
        {}
      );
      const gatewayData = response.data;
      gatewayData["city"] = gatewayData.location.city;
      gatewayData["street"] = gatewayData.location.street;
      gatewayData["zip"] = gatewayData.location.zip;

      delete gatewayData["location"];

      return { ...gatewayData, lastRecord };
    }

    function handleDelete(gateway) {
      const dtoIn = { id: gateway.id };
      return Calls.Gateway.delete(dtoIn, props.baseUri);
    }
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(gatewayDataList) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports
