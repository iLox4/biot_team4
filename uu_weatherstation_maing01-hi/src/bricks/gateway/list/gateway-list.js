//@@viewOn:imports
import UU5, { PropTypes } from "uu5g04";
import { createVisualComponent, useState, Lsi } from "uu5g05";
import Uu5TilesElements from "uu5tilesg02-elements";
import Uu5TilesControls from "uu5tilesg02-controls";
import Uu5Tiles from "uu5tilesg02";
import Config from "./config/config";
import GatewayItem from "./gateway-item";
import UpdateModal from "./update-modal";
import { useAlertBus } from "uu5g05-elements";
//@@viewOff:imports

const STATE_LIST = ["created", "active", "closed"];

//@@viewOn:css
const Css = {
  container: () => Config.Css.css({ padding: "auto", margin: "auto" }),
  controls: () => Config.Css.css({ display: "flex", gap: "10px", justifyContent: "flex-end", marginBottom: "15px" }),
};
//@@viewOff:css

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "GatewayList",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const GatewayList = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    gatewayDataList: PropTypes.object.isRequired,
    canManage: PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data, state } = props.gatewayDataList;
    const [filterList, setFilterList] = useState([]);
    const [updateData, setUpdateData] = useState({ isOpen: false, data: {} });
    const { addAlert } = useAlertBus();
    //@@viewOff:private

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

    function handleSetUpdateData(gatewayDataObject) {
      setUpdateData({ isOpen: true, data: gatewayDataObject });
    }

    function handleResetUpdateData() {
      setUpdateData({ isOpen: false, data: {} });
    }

    const CITY_LIST = [];
    if (state === "ready") {
      for (let item of data) {
        let itemCity = item.data.city;
        if (CITY_LIST.indexOf(itemCity) === -1) CITY_LIST.push(itemCity);
      }
    }

    const FILTER_LIST = [
      {
        key: "city",
        label: <Lsi lsi={{ cs: "Město", en: "City" }} />,
        filter: (item, value) => {
          return value.some((frag) => {
            let itemValue =
              typeof item.data.city === "object" ? Utils.Language.getItem(item.data.city) : item.data.city;
            return itemValue.toLowerCase().indexOf(frag.toLowerCase()) !== -1;
          });
        },
        inputType: "text-select",
        inputProps: {
          multiple: true,
          itemList: CITY_LIST.map((it) => ({ value: it, children: it })),
          placeholder: { en: "Enter value", cs: "Zadejte hodnotu" },
        },
      },
    ];

    if (props.canManage) {
      FILTER_LIST.push({
        key: "state",
        label: <Lsi lsi={{ cs: "Stav", en: "State" }} />,
        filter: (item, value) => {
          return value.some((frag) => {
            let itemValue =
              typeof item.data.state === "object" ? Utils.Language.getItem(item.data.state) : item.data.state;
            return itemValue.toLowerCase().indexOf(frag.toLowerCase()) !== -1;
          });
        },
        inputType: "text-select",
        inputProps: {
          multiple: true,
          itemList: STATE_LIST.map((it) => ({ value: it, children: it })),
          placeholder: { en: "Enter value", cs: "Zadejte hodnotu" },
        },
      });
    }

    let content;

    if (state === "ready") {
      content = (
        <Uu5Tiles.ControllerProvider
          data={data}
          filterDefinitionList={FILTER_LIST}
          filterList={filterList}
          onFilterChange={(e) => setFilterList(e.data.filterList)}
        >
          <div className={Css.controls()}>
            <Uu5TilesControls.SearchButton />
            <Uu5TilesControls.FilterButton />
          </div>
          <Uu5TilesControls.FilterBar />
          <Uu5TilesElements.Grid verticalGap={15} horizontalGap={15} tileMaxWidth={700} style={{padding: '3px'}}>
            <GatewayItem setUpdateData={handleSetUpdateData} canManage={props.canManage} />
          </Uu5TilesElements.Grid>
          {props.canManage && updateData.isOpen && (
            <UpdateModal
              onClose={handleResetUpdateData}
              gatewayDataObject={updateData.data}
              showInfo={showInfo}
              showError={showError}
            />
          )}
        </Uu5Tiles.ControllerProvider>
      );
    } else {
      content = <UU5.Bricks.Loading />;
    }

    //@@viewOn:render
    return <>{content}</>;
    //@@viewOff:render
  },
});

export default GatewayList;
