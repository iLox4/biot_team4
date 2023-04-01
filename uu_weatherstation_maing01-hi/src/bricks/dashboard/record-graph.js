//@@viewOn:imports
import UU5, { PropTypes } from "uu5g04";
import { createVisualComponent, useLsi } from "uu5g05";
import Config from "./config/config";
import importLsi from "./lsi/import-lsi";
import "uu5chartg01";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "RecordGraph",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const RecordGraph = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.array,
    granularity: PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, ["Graph"]);

    const modData = props.data.map((record) => {
      let date = new Date(record.datetime);
      let hlpLabel = date.toLocaleDateString("en-GB");
      let label = props.granularity === "1d" ? hlpLabel : hlpLabel + " " + date.getHours() + ":" + date.getMinutes();

      let rec = {
        label,
        value: record.temperature,
        value2: record.humidity,
      };
      return rec;
    });

    const series = [
      {
        valueKey: "value",
        name: lsi.temperature,
        colorSchema: "red",
        chartType: "monotone",
      },
      {
        valueKey: "value2",
        name: lsi.humidity,
        colorSchema: "blue",
        chartType: "monotone",
      },
    ];
    //@@viewOff:private

    //@@viewOn:render
    return (
      <UU5.Bricks.Container>
        {/*@@viewOn:0*/}
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
          data={modData}
          series={series}
        />
        {/*@@viewOff:0*/}
      </UU5.Bricks.Container>
    );
    //@@viewOff:render
  },
});

export default RecordGraph;
