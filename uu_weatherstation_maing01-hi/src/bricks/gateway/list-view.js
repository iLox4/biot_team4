//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi, useState } from "uu5g05";
import { useAlertBus } from "uu5g05-elements";
import { Grid } from "uu5tilesg02-elements";
import Tile from "./tile";
import Config from "./config/config.js";
import DetailModal from "./detail-modal";
import UpdateModal from "./update-modal";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
function getgatewayDataObject(gatewayDataList, id) {
  // HINT: We need to also check newData where are newly created items
  // that don't meet filtering, sorting or paging criteria.
  const item =
    gatewayDataList.newData?.find((item) => item?.data.id === id) ||
    gatewayDataList.data.find((item) => item?.data.id === id);

  return item;
}
//@@viewOff:helpers

const ListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    gatewayDataList: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    categoryList: PropTypes.array,
    profileList: PropTypes.array,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
    profileList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    const lsi = useLsi(importLsi, [ListView.uu5Tag]);
    const [detailData, setDetailData] = useState({ open: false, id: undefined });
    const [updateData, setUpdateData] = useState({ open: false, id: undefined });

    const activeDataObjectId = detailData.id || updateData.id;
    let activeDataObject;

    if (activeDataObjectId) {
      activeDataObject = getgatewayDataObject(props.gatewayDataList, activeDataObjectId);
    }

    function showError(error, header = "") {
      addAlert({
        header,
        message: error.message,
        priority: "error",
      });
    }

    async function handleDelete(gatewayDataObject) {
      try {
        await gatewayDataObject.handlerMap.delete();
      } catch (error) {
        ListView.logger.error("Error deleting gateway", error);
        showError(error, lsi.deleteFail);
        return;
      }

      addAlert({
        message: Utils.String.format(lsi.deleteDone, gatewayDataObject.data.name),
        priority: "success",
        durationMs: 2000,
      });
    }

    async function handleUpdate(gatewayDataObject) {
      setUpdateData({ open: true, id: gatewayDataObject.data.id });
    }

    async function handleUpdateSubmit(gatewayDataObject, values) {
      try {
        await gatewayDataObject.handlerMap.update(values);
      } catch (error) {
        ListView.logger.error("Error updating gateway", error);
        showError(error, lsi.updateFail, error);
        return;
      }

      setUpdateData({ open: false });
    }

    function handleUpdateCancel() {
      setUpdateData({ open: false });
    }

    async function handleLoadNext({ indexFrom }) {
      try {
        await props.gatewayDataList.handlerMap.loadNext({
          pageInfo: {
            pageIndex: Math.floor(indexFrom / props.gatewayDataList.pageSize),
          },
        });
      } catch (error) {
        ListView.logger.error("Error loading next page", error);
        showError(error, lsi.pageLoadFail);
      }
    }

    const handleItemDetailOpen = (gatewayDataObject) => setDetailData({ open: true, id: gatewayDataObject.data.id });
    const handleItemDetailClose = () => setDetailData({ open: false });
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    const tileProps = {
      profileList: props.profileList,
      identity: props.identity,
      categoryList: props.categoryList,
      onDetail: handleItemDetailOpen,
      onDelete: handleDelete,
      onUpdate: handleUpdate,
    };

    return (
      <div {...attrs}>
        <Grid
          data={props.gatewayDataList.data}
          onLoad={handleLoadNext}
          verticalGap={8}
          horizontalGap={8}
          tileHeight={300}
          tileMinWidth={400}
          tileMaxWidth={800}
          emptyState={lsi.nogateways}
        >
          <Tile {...tileProps} />
        </Grid>
        {detailData.open && activeDataObject && (
          <DetailModal
            gatewayDataObject={activeDataObject}
            profileList={props.profileList}
            identity={props.identity}
            categoryList={props.categoryList}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onClose={handleItemDetailClose}
            open
          />
        )}
        {updateData.open && (
          <UpdateModal
            gatewayDataObject={activeDataObject}
            categoryList={props.categoryList}
            onSubmit={handleUpdateSubmit}
            onCancel={handleUpdateCancel}
            open
          />
        )}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports
