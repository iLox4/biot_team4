//@@viewOn:imports
import { createVisualComponent, Lsi } from "uu5g05";
import UU5 from "uu5g04";
import { withRoute } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import * as UuWeatherstation from "uu_weatherstation-core";
import getParameterByName from "../utils/getParameterByName.js";
import ObjectProvider from "../bricks/gateway/detail/object-provider.js";
import { RouteController } from "uu_plus4u5g02-app";
import GetawayHeader from "../bricks/gateway/detail/getaway-header.js";
import Calls from "calls";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: () => Config.Css.css({ padding: "auto", margin: "auto", width: "80%", textAlign: "center" }),
};
//@@viewOff:css

const lsi = {
  notActive: <Lsi lsi={{ cs: "Tato meteostanice není aktivní!", en: "This meteostation is not active!" }} />,
};

const id = getParameterByName("id");

let Gateway = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Gateways",
  //@@viewOff:statics

  render() {
    //@@viewOn:private
    //@@viewOff:private
    return (
      <>
        <RouteBar />
        <div className={Css.container()}>
          <ObjectProvider id={id}>
            {(gatewayDataObject) => (
              <RouteController routeDataObject={gatewayDataObject}>
                {gatewayDataObject.state === "ready" && gatewayDataObject.data.state != "active" && (
                  <h1>{lsi.notActive}</h1>
                )}
                {gatewayDataObject.state === "ready" && gatewayDataObject.data.state === "active" && (
                  <GetawayHeader
                    header={
                      <h1>
                        {gatewayDataObject.data.name} - {gatewayDataObject.data.location.city},{" "}
                        {gatewayDataObject.data.location.street} {gatewayDataObject.data.location.zip}
                      </h1>
                    }
                    lastRecord={gatewayDataObject.data.lstRec}
                  />
                )}
                {gatewayDataObject.state === "ready" && gatewayDataObject.data.state === "active" && (
                  <UuWeatherstation.Dashboard.Dashboard listCall={(dtoIn) => Calls.Record.list(dtoIn)} gatewayId={id} />
                )}
                {gatewayDataObject.state === "pending" && <UU5.Bricks.Loading />}
              </RouteController>
            )}
          </ObjectProvider>
        </div>
      </>
    );
    //@@viewOff:render
  },
});

Gateway = withRoute(Gateway, { authenticated: false });

//@@viewOn:exports
export { Gateway };
export default Gateway;
//@@viewOff:exports
