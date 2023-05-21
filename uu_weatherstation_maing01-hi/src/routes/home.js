//@@viewOn:imports
import { Utils, createVisualComponent, useSession, Environment, Lsi } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";
import { useSystemData } from "uu_plus4u5g02";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar.js";
import ListProvider from "../bricks/gateway/list/list-provider.js";
import GatewayList from "../bricks/gateway/list/gateway-list.js";
import { RouteController } from "uu_plus4u5g02-app";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: () => Config.Css.css({ padding: "auto", margin: "auto", width: "40%" }),
};
//@@viewOff:css

const lsi = {
  header: <Lsi lsi={{ cs: "Meteostanice", en: "Meteostations" }} />,
};

let Home = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Home",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const systemDataObject = useSystemData();
    const { identity } = useSession();
    const { uuIdentity } = identity;

    const profileList = systemDataObject.data.awidData.authorizationData?.uuIdentityList.permissionMap;

    const canManage = profileList ? profileList[uuIdentity]?.includes("Authorities") : false;

    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    return (
      <div {...attrs}>
        <RouteBar />
        <div className={Css.container()}>
          <h1>{lsi.header}</h1>
          <ListProvider>
            {(gatewayDataList) => (
              <RouteController routeDataObject={gatewayDataList}>
                <GatewayList gatewayDataList={gatewayDataList} canManage={canManage} />
              </RouteController>
            )}
          </ListProvider>
        </div>
      </div>
    );
    //@@viewOff:render
  },
});

Home = withRoute(Home, { authenticated: true });

//@@viewOn:exports
export { Home };
export default Home;
//@@viewOff:exports
