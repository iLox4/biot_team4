//@@viewOn:imports
import { createVisualComponent, useSession } from "uu5g05";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import { RouteController } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import ListProvider from "../bricks/gateway/list-provider";
import ListTitle from "../bricks/gateway/list-title";
import ListView from "../bricks/gateway/list-view";
import CreateView from "../bricks/gateway/create-view";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: () => Config.Css.css({ maxWidth: 640, margin: "0px auto", paddingLeft: 8, paddingRight: 8 }),
  createView: () => Config.Css.css({ margin: "24px 0px" }),
};
//@@viewOff:css

let Gateways = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Gateways",
  //@@viewOff:statics

  render() {
    //@@viewOn:private
    const subAppDataObject = useSubAppData();
    const systemDataObject = useSystemData();
    const { identity } = useSession();

    //@@viewOff:private

    //@@viewOn:render
    return (
      <>
        <RouteBar />
        <ListProvider>
          {(gatewayDataList) => (
            <RouteController routeDataObject={gatewayDataList}>
              <div className={Css.container()}>
                
              <CreateView
                  gatewayDataList={gatewayDataList}
                  categoryList={["5c9237a0323cc0000c303028", "5c9237c1323cc0000c30302e"]}
                  className={Css.createView()}
                />
                
                <ListView
                  gatewayDataList={gatewayDataList}
                  categoryList={["5c9237a0323cc0000c303028", "5c9237c1323cc0000c30302e"]}
                  identity={identity}
                />
                <ListTitle gatewayList={gatewayDataList.data} />
              </div>
            </RouteController>
          )}
        </ListProvider>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Gateways };
export default Gateways;
//@@viewOff:exports
