//@@viewOn:imports
import { createVisualComponent, useEffect, useState, Lsi } from "uu5g05";
import UU5 from "uu5g04";
import { withRoute } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import Dashboard from "../bricks/dashboard/dashboard.js";
import getParameterByName from "../utils/getParameterByName.js";
import Plus4U5 from "uu_plus4u5g02";
import { useAlertBus } from "uu5g05-elements";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: () => Config.Css.css({ padding: "auto", margin: "auto", width: "80%" }),
};
//@@viewOff:css

const lsi = {
  errorHeader: <Lsi lsi={{ cs: "Načítání dat se nezdařilo", en: "Getting data failed" }} />,
  errorMessage: <Lsi lsi={{ cs: "Nepodařilo se získat data ze serveru", en: "Failed to get data from the server" }} />,
};

const id = getParameterByName("id");

async function handleLoad() {
  const response = await Plus4U5.Utils.AppClient["get"](
    "http://localhost:8080/uu-weatherstation-maing01/22222222222222222222222222222222/gateway/get",
    {
      id,
    }
  );
  return response;
}

let Gateway = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Gateways",
  //@@viewOff:statics

  render() {
    //@@viewOn:private
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [gatewayData, setGatewayData] = useState({});
    const { addAlert } = useAlertBus();
    //@@viewOff:private

    useEffect(() => {
      async function fetchData() {
        setIsLoading(true);
        try {
          const response = await handleLoad();
          setGatewayData(response.data);
        } catch (error) {
          Gateway.logger.error("Error getting a gateway data", error);
          addAlert({
            header: lsi.errorHeader,
            message: lsi.errorMessage,
            priority: "error",
          });
          setIsError(true);
        }
        setIsLoading(false);
      }
      fetchData();
    }, []);

    let content;
    if (isLoading) {
      content = <UU5.Bricks.Loading />;
    } else if (isError) {
      content = <h1>{lsi.errorMessage}</h1>;
    } else {
      content = (
        <>
          <Dashboard
            url="http://localhost:8080/uu-weatherstation-maing01/22222222222222222222222222222222/record/getInterval"
            gatewayId={id}
            header={
              <h1>
                {gatewayData.name} - {gatewayData.location.city}, {gatewayData.location.street}{" "}
                {gatewayData.location.zip}
              </h1>
            }
          />
        </>
      );
    }
    //@@viewOn:render
    return (
      <>
        <RouteBar />
        <div className={Css.container()}>{content}</div>
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
