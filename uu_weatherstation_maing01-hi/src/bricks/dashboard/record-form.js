//@@viewOn:imports
import { PropTypes } from "uu5g04";
import Uu5Forms from "uu5g05-forms";
import Uu5Elements from "uu5g05-elements";
import { createVisualComponent, useState, useLsi } from "uu5g05";
import { getPossibleGranularitiesList } from "../../../../uu_weatherstation_maing01-server/app/utils/granularityUtils";
import Config from "./config/config";
import { UuDate } from "uu_i18ng01";
import importLsi from "./lsi/import-lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "RecordForm",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

const Css = {
  container: () => Config.Css.css({ padding: "auto", margin: "auto", width: "50%" }),
  inputLabel: () => Config.Css.css({ marginBottom: "5px" }),
};

const initialGrans = ["5m", "10m", "15m", "30m", "1h", "12h", "1d"].map((value) => {
  return { value };
});

export const RecordForm = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const limits = [new UuDate().shiftYear(-1).toIsoString(), new UuDate().shiftMonth(1).toIsoString()];
    const [avaibleGrans, setGrans] = useState(initialGrans);
    const [dateRange, setDateRange] = useState([new UuDate().shiftDay(-1).toIsoString(), new UuDate().toIsoString()]);
    const [isoRange, setIsoRange] = useState([
      new Date(new UuDate().shiftDay(-1).toIsoString()).toISOString(),
      new Date(new UuDate().toIsoString()).toISOString(),
    ]);
    const lsi = useLsi(importLsi, ["Form"]);

    const updateGrans = (startDate, endDate) => {
      setGrans(
        getPossibleGranularitiesList(startDate, endDate).map((value) => {
          return { value };
        })
      );
    };

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <div className={Css.container()}>
        {props.header}
        <Uu5Forms.Form
          onSubmit={async (e) => {
            await props.onSubmit({ ...e.data.value, startDate: isoRange[0], endDate: isoRange[1] });
          }}
        >
          <Uu5Elements.Block
            headerType="heading"
            card="content"
            width="200px"
            footer={
              <div>
                <Uu5Forms.SubmitButton>{lsi.get}</Uu5Forms.SubmitButton>
              </div>
            }
          >
            <div>
              <h4 className={Css.inputLabel()}>{lsi.interval}</h4>
              <Uu5Forms.DateRange.Input
                disabled={props.isLoading}
                min={limits[0]}
                max={limits[1]}
                required
                value={dateRange}
                onChange={(e) => {
                  let startDate = new Date(e.data.value[0]).toISOString();
                  let endDate = new Date(e.data.value[1]).toISOString();
                  updateGrans(startDate, endDate);
                  setIsoRange([startDate, endDate]);
                  setDateRange(e.data.value);
                }}
              />
            </div>
            <div>
              <h4 className={Css.inputLabel()}>{lsi.granularity}</h4>
              <Uu5Forms.FormSwitchSelect name="granularity" itemList={avaibleGrans} required />
            </div>
          </Uu5Elements.Block>
        </Uu5Forms.Form>
      </div>
    );
    //@@viewOff:render
  },
});

export default RecordForm;
