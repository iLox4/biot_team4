//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi } from "uu5g05";
import { Form, FormText, FormSelect, FormFile, FormTextArea, SubmitButton, CancelButton } from "uu5g05-forms";
import Config from "./config/config.js";
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

const CreateForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    categoryList: PropTypes.array,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
    onSubmit: () => {},
    onCancel: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [CreateForm.uu5Tag]);

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
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    return (
      <Form {...elementProps} onSubmit={props.onSubmit} onValidate={handleValidate}>
        <FormText label={lsi.name} name="name" maxLength={255} className={Css.input()} required autoFocus />

        <FormText label={lsi.location} name="location" maxLength={255} className={Css.input()} required autoFocus />

        <FormSelect
          label={lsi.vyber}
          name="categoryIdList"
          itemList={getCategoryItemList(props.categoryList)}
          className={Css.input()}
          multiple
        />

        

        
        <div className={Css.controls()}>
          <CancelButton onClick={props.onCancel}>{lsi.cancel}</CancelButton>
          <SubmitButton>{lsi.submit}</SubmitButton>
        </div>
      </Form>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { CreateForm };
export default CreateForm;
//@@viewOff:exports
