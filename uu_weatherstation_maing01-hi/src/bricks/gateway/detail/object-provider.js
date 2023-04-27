//@@viewOn:imports
import { createComponent, useDataObject } from "uu5g05";
import Config from "./config/config";
import Plus4U5 from "uu_plus4u5g02";
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
      return await Calls.Gateway.get({ id: props.id });
    }
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(gatewayDataObject) : props.children;
    //@@viewOff:render
  },
});

export default ObjectProvider;
