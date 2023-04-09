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

const SORTER_LIST = [
  {
    key: "name",
    label: <Lsi lsi={{ cs: "Název", en: "Name" }} />,
    sort: (a, b) => a.data.name.localeCompare(b.data.name),
  },
  {
    key: "city",
    label: <Lsi lsi={{ cs: "Město", en: "City" }} />,
    sort: (a, b) => a.data.city.localeCompare(b.data.city),
  },
  {
    key: "temperature",
    label: <Lsi lsi={{ cs: "Teplota", en: "Temperature" }} />,
    sort: (a, b) => a.data.lastRecord.temperature - b.data.lastRecord.temperature,
  },
  {
    key: "humidity",
    label: <Lsi lsi={{ cs: "Vlhkost", en: "Humidity" }} />,
    sort: (a, b) => a.data.lastRecord.humidity - b.data.lastRecord.humidity,
  },
];

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
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data, state } = props.gatewayDataList;
    const [sorterList, setSorterList] = useState([{ key: "name", ascending: true }]);
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
      {
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
      },
    ];

    let content;

    if (state === "ready") {
      content = (
        <Uu5Tiles.ControllerProvider
          data={data}
          sorterDefinitionList={SORTER_LIST}
          sorterList={sorterList}
          onSorterChange={(e) => setSorterList(e.data.sorterList)}
          filterDefinitionList={FILTER_LIST}
          filterList={filterList}
          onFilterChange={(e) => setFilterList(e.data.filterList)}
        >
          <div className={Css.controls()}>
            <Uu5TilesControls.SorterButton />
            <Uu5TilesControls.SearchButton />
            <Uu5TilesControls.FilterButton />
          </div>
          <Uu5TilesControls.SorterBar />
          <Uu5TilesControls.FilterBar />
          <Uu5TilesElements.Grid verticalGap={15} horizontalGap={15} tileMaxWidth={700}>
            <GatewayItem setUpdateData={handleSetUpdateData} />
          </Uu5TilesElements.Grid>
          {updateData.isOpen && (
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
