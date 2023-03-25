//@@viewOn:imports
import { createComponent, PropTypes, useEffect } from "uu5g05";
import Config from "./config/config";
//@@viewOff:imports

const ListTitle = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ListTitle",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    gatewayList: PropTypes.array,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    gatewayList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private

    /* Title */
    
    //@@viewOff:private

    //@@viewOn:render
    return null;
    //@@viewOff:render
  },
});

export default ListTitle;
