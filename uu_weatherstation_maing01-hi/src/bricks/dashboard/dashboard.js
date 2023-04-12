//@@viewOn:imports
import { createVisualComponent, useState, useLsi, Utils } from "uu5g05";
import UU5, { PropTypes } from "uu5g04";
import Config from "./config/config";
import RecordForm from "./record-form";
import RecordGraph from "./record-graph";
import { useAlertBus } from "uu5g05-elements";
import importLsi from "./lsi/import-lsi";
//import Calls from "calls";
import Plus4U5 from "uu_plus4u5g02";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Dashboard",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const Dashboard = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    gatewayId: PropTypes.string,
    url: PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [granularity, setGranularity] = useState("");
    const lsi = useLsi(importLsi, ["Dashboard"]);
    const { gatewayId, url } = props;

    function showError(error, header = "") {
      addAlert({
        header,
        message: error.message,
        priority: "error",
      });
    }

    function showInfo(info, header = "") {
      addAlert({
        header,
        message: info,
        priority: "info",
      });
    }

    const handleSubmit = async (input) => {
      input = { ...input, gatewayId };
      setIsLoading(true);
      try {
        const response = await Plus4U5.Utils.AppClient["get"](url, input, {});
        if (response.data.itemList.length === 0) {
          showInfo(lsi.missingData, lsi.missingDataHeader);
          setData([]);
        } else {
          if (input.granularity !== response.data.granularity) {
            showInfo(
              Utils.String.format(lsi.granularityChanged, input.granularity, response.data.granularity),
              lsi.granularityChangedHeader
            );
          }
          setGranularity(response.data.granularity);
          setData(response.data.itemList);
        }
      } catch (error) {
        Dashboard.logger.error("Error getting a list of records", error);
        showError(lsi.gettingDataError, lsi.gettingDataErrorHeader);
        console.log(error);
      }
      setIsLoading(false);
    };

    //@@viewOff:private

    //@@viewOn:render
    return (
      <>
        <RecordForm onSubmit={handleSubmit} isLoading={isLoading} header={props.header} />
        {!isLoading && data.length > 0 && <RecordGraph data={data} granularity={granularity} />}
        <div
          className={Config.Css.css({
            marginTop: "50px",
          })}
        >
          {isLoading && <UU5.Bricks.Loading />}
        </div>
      </>
    );
    //@@viewOff:render
  },
});

export default Dashboard;
