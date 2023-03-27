//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes, useLsi, useLanguage, useUserPreferences } from "uu5g05";
import { Modal, Box, Line, Text, DateTime } from "uu5g05-elements";
import { PersonPhoto } from "uu_plus4u5g02-elements";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  content: () =>
    Config.Css.css({
      marginTop: -16,
      marginLeft: -24,
      marginRight: -24,
      marginBottom: -16,
    }),

  image: () =>
    Config.Css.css({
      display: "block",
      maxWidth: "100%",
      margin: "auto",
    }),

  text: () =>
    Config.Css.css({
      display: "block",
      marginLeft: 24,
      marginRight: 24,
      marginTop: 16,
      marginBottom: 16,
    }),

  infoLine: () =>
    Config.Css.css({
      display: "block",
      marginLeft: 24,
      marginTop: 8,
    }),

  footer: () =>
    Config.Css.css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      marginTop: 8,
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 24,
      paddingRight: 24,
    }),

  photo: () =>
    Config.Css.css({
      marginRight: 8,
    }),
};
//@@viewOff:css

//@@viewOn:helpers
function hasManagePermission(gateway, identity, profileList) {
  const isAuthority = profileList.includes("Authorities");
  const isExecutive = profileList.includes("Executives");
  const isOwner = gateway.uuIdentity === identity.uuIdentity;
  return isAuthority || (isExecutive && isOwner);
}

function InfoLine({ children }) {
  return (
    <Text
      category="interface"
      segment="content"
      type="medium"
      significance="subdued"
      colorScheme="building"
      className={Css.infoLine()}
    >
      {children}
    </Text>
  );
}

function buildCategoryNames(categoryIdList, categoryList) {
  // for faster lookup
  let categoryIds = new Set(categoryIdList);
  return categoryList
    .reduce((acc, category) => {
      if (categoryIds.has(category.id)) {
        acc.push(category.name);
      }
      return acc;
    }, [])
    .join(", ");
}
//@@viewOff:helpers

const DetailModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DetailModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    gatewayDataObject: PropTypes.object.isRequired,
    categoryList: PropTypes.array,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [preferences] = useUserPreferences();
    const [language] = useLanguage();
    const lsi = useLsi(importLsi, [DetailModal.uu5Tag]);

  

    function getActions() {
      const isActionDisabled = props.gatewayDataObject.state === "pending";
      const canManage = hasManagePermission(props.gatewayDataObject.data, props.identity, props.profileList);
      let actionList = [];

     
        actionList.push({
          icon: "mdi-pencil",
          children: lsi.update,
          onClick: () => props.onUpdate(props.gatewayDataObject),
          disabled: isActionDisabled,
          primary: true,
        });

        actionList.push({
          icon: "mdi-delete",
          children: lsi.delete,
          onClick: () => props.onDelete(props.gatewayDataObject),
          disabled: isActionDisabled,
          collapsed: true,
        });
      

      return actionList;
    }
    //@@viewOff:private

    //@@viewOn:render
    const gateway = props.gatewayDataObject.data;

    return (
      <Modal header={gateway.name} onClose={props.onClose} actionList={getActions()} open>
        <div className={Css.content()}>
          {gateway.location.city && (
            <Text category="interface" segment="content" type="medium" colorScheme="building" className={Css.text()}>
              {gateway.location.city}
            </Text>
          )}
          {gateway.location.street && (
            <Text category="interface" segment="content" type="medium" colorScheme="building" className={Css.text()}>
              {gateway.location.street}
            </Text>
          )}
          {gateway.location.zip && (
            <Text category="interface" segment="content" type="medium" colorScheme="building" className={Css.text()}>
              {gateway.location.zip}
            </Text>
          )}

          {gateway.categoryIdList?.length > 0 && (
            <InfoLine>{buildCategoryNames(gateway.categoryIdList, props.categoryList)}</InfoLine>
          )}

          <InfoLine>
            <DateTime value={gateway.sys.cts} dateFormat="short" timeFormat="none" />
          </InfoLine>

          

          <Box significance="distinct" className={Css.footer()}>
          
            
          </Box>
        </div>
      </Modal>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DetailModal };
export default DetailModal;
//@@viewOff:exports
