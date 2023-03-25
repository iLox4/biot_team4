//@@viewOn:imports
import { createVisualComponent, PropTypes, useLsi } from "uu5g05";
import { Modal } from "uu5g05-elements";
import { Form, FormText, FormTextArea, FormSelect, FormFile, SubmitButton, CancelButton } from "uu5g05-forms";
import Config from "./config/config";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  input: () => Config.Css.css({ marginBottom: 16 }),
  controls: () => Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" }),
};
//@@viewOff:css

//@@viewOn:helpers
function getCategoryItemList(categoryList) {
 
   
  }

//@@viewOff:helpers

export const UpdateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    gatewayDataObject: PropTypes.object.isRequired,
    categoryList: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [UpdateModal.uu5Tag]);

    async function handleSubmit(event) {
      const values = { ...event.data.value };

      if (props.gatewayDataObject.data.image && !values.image) {
        delete values.image;
        values.deleteImage = true;
      }

      return props.onSubmit(props.gatewayDataObject, values);
    }

    function handleValidate(event) {
      const { text, image } = event.data.value;

      if (text && image) {
        return {
          message: lsi.textOrImage,
        };
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const gateway = props.gatewayDataObject.data;

    const formControls = (
      <div className={Css.controls()}>
        <CancelButton onClick={props.onCancel}>{lsi.cancel}</CancelButton>
        <SubmitButton>{lsi.submit}</SubmitButton>
      </div>
    );

    return (
      <Form.Provider onSubmit={handleSubmit} onValidate={handleValidate}>
        <Modal header={lsi.header} footer={formControls} open>
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
              label={lsi.location}
              name="name"
              initialValue={gateway.name}
              maxLength={255}
              className={Css.input()}
              required
              autoFocus
            />

            <FormSelect
              label={lsi.vyber}
              name="categoryIdList"
              initialValue={gateway.categoryIdList}
              itemList={getCategoryItemList(props.categoryList)}
              className={Css.input()}
              multiple
            />

        

           
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

export default UpdateModal;
