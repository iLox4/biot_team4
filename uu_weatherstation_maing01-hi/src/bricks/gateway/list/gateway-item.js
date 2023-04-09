//@@viewOn:imports
import { PropTypes } from "uu5g04";
import { createVisualComponent, useRoute, Lsi } from "uu5g05";
import { Box, Button } from "uu5g05-elements";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: () => Config.Css.css({ padding: "10px" }),
  header: () => Config.Css.css({ marginTop: "0" }),
  footer: () => Config.Css.css({ display: "flex", alignItems: "center", justifyContent: "space-between" }),
  actions: () => Config.Css.css({ display: "flex", gap: "10px" }),
};
//@@viewOff:css

const lsi = {
  humidity: <Lsi lsi={{ cs: "Vlhkost", en: "Humidity" }} />,
  state: <Lsi lsi={{ cs: "Stav", en: "State" }} />,
  update: <Lsi lsi={{ cs: "Změnit", en: "Update" }} />,
  more: <Lsi lsi={{ cs: "Více", en: "More" }} />,
};

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "GatewayItem",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const GatewayItem = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.object,
    setUpdateData: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { id, state } = props.data.data;
    const [, setRoute] = useRoute();
    //@@viewOff:private
    let lastRecord, name;
    if (props.data.data["lastRecord"]) {
      lastRecord = props.data.data["lastRecord"];
    } else {
      lastRecord = null;
    }
    if (props.data.data["name"]) {
      name = props.data.data["name"];
    } else {
      name = "";
    }

    let isNotActive = state !== "active" ? true : false;

    let location;
    let record;
    if (!isNotActive) {
      const { city, street, zip } = props.data.data;
      location = (
        <h2 className={Css.header()}>
          {name} - {city}, {street} {zip}
        </h2>
      );
      if (lastRecord) {
        let date = new Date(lastRecord.datetime);
        let hlpLabel = date.toLocaleDateString("en-GB");
        let formatedDateTime = hlpLabel + " " + date.getHours() + ":" + date.getMinutes();

        record = (
          <p>
            {formatedDateTime}:{" "}
            <b>
              {lastRecord.temperature}C, {lastRecord.humidity}% {lsi.humidity}
            </b>
          </p>
        );
      } else {
        record = <></>;
      }
    } else {
      location = <></>;
      record = <></>;
    }

    //@@viewOn:render
    return (
      <Box>
        <div className={Css.container()}>
          <div>{location}</div>
          <div>{record}</div>
          <div className={Css.footer()}>
            <i>
              {lsi.state}: <b>{state}</b>
            </i>
            <div className={Css.actions()}>
              <Button onClick={() => props.setUpdateData(props.data)}>{lsi.update}</Button>
              <Button onClick={() => setRoute("gateway", { id })} colorScheme="primary" disabled={isNotActive}>
                {lsi.more}
              </Button>
            </div>
          </div>
        </div>
      </Box>
    );
    //@@viewOff:render
  },
});

export default GatewayItem;
