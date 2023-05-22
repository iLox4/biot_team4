//@@viewOn:imports
import { PropTypes } from "uu5g04";
import { createVisualComponent, Lsi } from "uu5g05";
import Config from "./config/config";
import { Modal } from "uu5g05-elements";
import { Form, FormText, FormSelect, SubmitButton, CancelButton } from "uu5g05-forms";
//@@viewOff:imports

const STATE_LIST = [{ value: "created" }, { value: "active" }, { value: "closed" }];

//@@viewOn:css
const Css = {
  input: () => Config.Css.css({ marginBottom: 16 }),
  controls: () => Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" }),
};
//@@viewOff:css

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "UpdateModal",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

const lsi = {
  name: <Lsi lsi={{ cs: "Název", en: "Name" }} />,
  city: <Lsi lsi={{ cs: "Město", en: "City" }} />,
  street: <Lsi lsi={{ cs: "Ulice", en: "Street" }} />,
  zip: <Lsi lsi={{ cs: "PSČ", en: "ZIP" }} />,
  state: <Lsi lsi={{ cs: "Stav", en: "State" }} />,
  cancel: <Lsi lsi={{ cs: "Zrušit", en: "Cancel" }} />,
  submit: <Lsi lsi={{ cs: "Potvrdit", en: "Submit" }} />,
  successInfo: <Lsi lsi={{ cs: "Údaje byly úspěšně změněny", en: "Data was successfully updated" }} />,
  errorInfo: <Lsi lsi={{ cs: "Nepodařilo se uložit změny", en: "Gateway update failed" }} />,
};

export const UpdateModal = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    gatewayDataObject: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    showError: PropTypes.func,
    showInfo: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const gateway = props.gatewayDataObject.data;

    async function handleSubmit(event) {
      const inputData = { ...event.data.value };
      inputData["location"] = {};

      inputData.location["city"] = inputData.city;
      inputData.location["street"] = inputData.street;
      inputData.location["zip"] = inputData.zip;
      inputData["id"] = gateway.id;

      delete inputData["city"];
      delete inputData["street"];
      delete inputData["zip"];

      try {
        await props.gatewayDataObject.handlerMap.update(inputData, gateway.lastRecord);
        props.onClose();
        props.showInfo(lsi.successInfo);
      } catch (error) {
        UpdateModal.logger.error("Error updating gateway", error);
        props.showError(lsi.errorInfo);
      }
    }

    const formControls = (
      <div className={Css.controls()}>
        <CancelButton onClick={() => props.onClose()}>{lsi.cancel}</CancelButton>
        <SubmitButton>{lsi.submit}</SubmitButton>
      </div>
    );
    //@@viewOff:private
    //@@viewOn:render
    return (
      <Form.Provider onSubmit={(e) => handleSubmit(e)}>
        <Modal footer={formControls} open>
          <Form.View>
            <FormText
              label={lsi.name}
              name="name"
              initialValue={gateway.name}
              maxLength={255}
              className={Css.input()}
              required
              autoFocus
            />

            <FormText
              label={lsi.city}
              name="city"
              initialValue={gateway.city}
              maxLength={255}
              className={Css.input()}
              required
              autoFocus
            />

            <FormText
              label={lsi.street}
              name="street"
              initialValue={gateway.street}
              maxLength={255}
              className={Css.input()}
              required
              autoFocus
            />

            <FormText
              label={lsi.zip}
              name="zip"
              initialValue={gateway.zip}
              maxLength={15}
              minLength={4}
              className={Css.input()}
              required
              autoFocus
            />

            <FormSelect
              label={lsi.state}
              name="state"
              initialValue={gateway.state}
              itemList={STATE_LIST}
              className={Css.input()}
              required
            />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

export default UpdateModal;
