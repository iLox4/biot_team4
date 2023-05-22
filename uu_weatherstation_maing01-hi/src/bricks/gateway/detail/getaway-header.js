//@@viewOn:imports
import { PropTypes } from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "GetawayHeader",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const GetawayHeader = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    lastRecord: PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { header } = props;

    let tempHumData;
    if (props.lastRecord) {
      const datetime = new Date(props.lastRecord.datetime);
      const timeOffset = datetime.getTimezoneOffset() / 60;
      datetime.setHours(datetime.getHours() - timeOffset);

      const date = datetime.toLocaleDateString("en-GB");

      const hours = String(datetime.getHours()).length === 1 ? "0" + datetime.getHours() : datetime.getHours();
      const minutes = String(datetime.getMinutes()).length === 1 ? "0" + datetime.getMinutes() : datetime.getMinutes();

      tempHumData =
        date +
        " " +
        hours +
        ":" +
        minutes +
        " - " +
        props.lastRecord.temperature +
        "°C " +
        props.lastRecord.humidity +
        "%";
    } else {
      tempHumData = "";
    }

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <div>
        {header}
        <h3>{tempHumData}</h3>
      </div>
    );
    //@@viewOff:render
  },
});

export default GetawayHeader;
