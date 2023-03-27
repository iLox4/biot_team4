//@@viewOn:imports
import { createComponent, useDataList, useEffect, useRef } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

const ListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const gatewayDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        loadNext: handleLoadNext,
        create: handleCreate,
      },
      itemHandlerMap: {
        update: handleUpdate,
        delete: handleDelete,
        getImage: handleGetImage,
      },
      pageSize: 50,
    });

    const imageUrlListRef = useRef([]);

    function handleLoad(dtoIn) {
      return Calls.Gateway.list(dtoIn);
    }

    function handleLoadNext(dtoIn) {
      return Calls.Gateway.list(dtoIn);
    }

    function handleCreate(values) {
      return Calls.Gateway.create(values);
    }

    function handleUpdate(values) {
      return Calls.Gateway.update(values);
    }

    function handleDelete(gateway) {
      const dtoIn = { id: gateway.id };
      return Calls.Gateway.delete(dtoIn, props.baseUri);
    }

    async function handleGetImage(gateway) {
      const dtoIn = { code: gateway.image };
      const imageFile = await Calls.gateway.getImage(dtoIn);
      const imageUrl = generateAndRegisterImageUrl(imageFile);
      return { ...gateway, imageFile, imageUrl };
    }

    function generateAndRegisterImageUrl(imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      imageUrlListRef.current.push(imageUrl);
      return imageUrl;
    }

    useEffect(() => {
      // We don't use it to store reference on another React component
      // eslint-disable-next-line uu5/hooks-exhaustive-deps
      return () => imageUrlListRef.current.forEach((url) => URL.revokeObjectURL(url));
      // We want to trigger this effect only once.
      // eslint-disable-next-line uu5/hooks-exhaustive-deps
    }, []);
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(gatewayDataList) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports