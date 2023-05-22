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
      const response = await Calls.Gateway.list(dtoIn);
      response.itemList = response.itemList.map((record) => {
        let newRecord = { ...record, ...record.location };
        delete newRecord.location;
        return newRecord;
      });

      return response;
    }

    async function handleUpdate(dtoIn, lastRecord) {
      const response = await Calls.Gateway.update(dtoIn);
      const gatewayData = response;
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
