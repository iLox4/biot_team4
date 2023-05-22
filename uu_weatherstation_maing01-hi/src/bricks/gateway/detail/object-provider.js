//@@viewOn:imports
import { createComponent, useDataObject } from "uu5g05";
import Config from "./config/config";
import { PropTypes } from "uu5g04";
import Calls from "calls";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ObjectProvider",
  //@@viewOff:statics
};

export const ObjectProvider = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    id: PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const gatewayDataObject = useDataObject({
      initialDtoIn: props.id,
      handlerMap: {
        load: handleLoad,
      },
    });

    async function handleLoad() {
      const lastRecord = await Calls.Gateway.getLastRecord({ id: props.id });
      const gateway = await Calls.Gateway.get({ id: props.id });
      return {
        ...gateway,
        lstRec: { temperature: lastRecord.temperature, humidity: lastRecord.humidity, datetime: lastRecord.datetime },
      };
    }
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(gatewayDataObject) : props.children;
    //@@viewOff:render
  },
});

export default ObjectProvider;
