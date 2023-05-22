//@@viewOn:imports
import UU5, { PropTypes } from "uu5g04";
import { createVisualComponent, Lsi } from "uu5g05";
import Config from "./config/config";
import "uu5chartg01";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "RecordGraph",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

const lsi = {
  temperature: <Lsi lsi={{ cs: "Teplota", en: "Temperature" }} />,
  humidity: <Lsi lsi={{ cs: "Vlhkost", en: "Humidity" }} />,
}

const seriesTemp = [
  {
    valueKey: "value",
    name: `${lsi.temperature}`,
    colorSchema: "red",
    chartType: "monotone",
  },
];

const seriesHum = [
  {
    valueKey: "value",
    name: `${lsi.humidity}`,
    colorSchema: "blue",
    chartType: "monotone",
  },
];

export const RecordGraph = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.array,
    granularity: PropTypes.string,
    timeOff: PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const tempData = [];
    const humData = [];
    let prevDate = "";

    props.data.forEach((record) => {
      const datetime = new Date(record.datetime);
      const timeOffset = datetime.getTimezoneOffset() / 60;
      datetime.setHours(datetime.getHours() - timeOffset);

      const date = datetime.toLocaleDateString("en-GB");

      const hours = String(datetime.getHours()).length === 1 ? "0" + datetime.getHours() : datetime.getHours();
      const minutes = String(datetime.getMinutes()).length === 1 ? "0" + datetime.getMinutes() : datetime.getMinutes();

      let label;
      if (props.granularity === "1d") {
        label = date;
      } else if (prevDate !== date) {
        label = date + " " + hours + ":" + minutes;
      } else {
        label = hours + ":" + minutes;
      }

      tempData.push({
        label,
        value: record.temperature,
      });

      humData.push({
        label,
        value: record.humidity,
      });

      prevDate = date;
    });
    //@@viewOff:private

    //@@viewOn:render
    return (
      <UU5.Bricks.Container>
        <h2>{lsi.temperature} (*C)</h2>
        <UU5.SimpleChart.AreaChart
          labelKey="label"
          chartType="monotone"
          colorSchema="default"
          stacked={true}
          displayCartesianGrid={false}
          responsive
          isAnimationActive
          displayTooltip
          gradient
          data={tempData}
          series={seriesTemp}
        />

        <h2>{lsi.humidity} (%)</h2>
        <UU5.SimpleChart.AreaChart
          labelKey="label"
          chartType="monotone"
          colorSchema="default"
          stacked={true}
          displayCartesianGrid={false}
          responsive
          isAnimationActive
          displayTooltip
          gradient
          data={humData}
          series={seriesHum}
        />
      </UU5.Bricks.Container>
    );
    //@@viewOff:render
  },
});

export default RecordGraph;
