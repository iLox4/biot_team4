//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useEffect, useLsi, useUserPreferences } from "uu5g05";
import { Box, Text, Button, Pending } from "uu5g05-elements";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  main: () =>
    Config.Css.css({
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }),

  header: () =>
    Config.Css.css({
      display: "block",
      padding: 16,
      height: 48,
    }),

  content: (image) =>
    Config.Css.css({
      display: "flex",
      alignItems: image ? "center" : "left",
      justifyContent: image ? "center" : "flex-start",
      height: "calc(100% - 48px - 48px)",
      overflow: "hidden",
    }),

  text: () =>
    Config.Css.css({
      display: "block",
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 16,
    }),

  image: () => Config.Css.css({ width: "100%" }),

  footer: () =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 48,
      paddingLeft: 16,
      paddingRight: 8,
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
//@@viewOff:helpers

const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    categoryList: PropTypes.array,
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
    const lsi = useLsi(importLsi, [Tile.uu5Tag]);
    const gatewayDataObject = props.data;

    useEffect(() => {
      if (
      
        gatewayDataObject.state === "ready" &&
        gatewayDataObject.handlerMap?.getImage
      ) {
        gatewayDataObject.handlerMap
          .getImage(gatewayDataObject.data)
          .catch((error) => Tile.logger.error("Error loading image", error));
      }
    }, [gatewayDataObject]);

    function handleDelete(event) {
      event.stopPropagation();
      props.onDelete(gatewayDataObject);
    }

    function handleUpdate(event) {
      event.stopPropagation();
      props.onUpdate(gatewayDataObject);
    }

    function handleDetail() {
      props.onDetail(gatewayDataObject);
    }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props, Css.main());
    const gateway = gatewayDataObject.data;
    const canManage = hasManagePermission(gateway, props.identity, props.profileList);
    const isActionDisabled = gatewayDataObject.state === "pending";

    return (
      <Box {...elementProps} onClick={handleDetail}>
        <Text category="interface" segment="title" type="minor" colorScheme="building" className={Css.header()}>
          {gateway.name}
        </Text>

        <div className={Css.content(gateway.image)}>
          {gateway.lastRecord.temperature &&  (
            <Text category="interface" segment="content" type="medium" colorScheme="building" className={Css.text()}>
              {gateway.lastRecord.temperature}
            </Text>  
          )}

          {gateway.lastRecord.humidity &&  (
            <Text category="interface" segment="content" type="medium" colorScheme="building" className={Css.text()}>
              {gateway.lastRecord.humidity}
            </Text>  
          )}
          
          
        
        </div>

        <Box significance="distinct" className={Css.footer()}>
          
          
          {canManage && (
            <div>
              <Button
                icon="mdi-pencil"
                onClick={handleUpdate}
                significance="subdued"
                tooltip={lsi.updateTip}
                disabled={isActionDisabled}
              />
              <Button
                icon="mdi-delete"
                onClick={handleDelete}
                significance="subdued"
                tooltip={lsi.deleteTip}
                disabled={isActionDisabled}
              />
            </div>
          )}
        </Box>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Tile };
export default Tile;
//@@viewOff:exports
