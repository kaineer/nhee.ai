import { type TreeState } from "./treeSlice.types";
import { type DataNode } from "../../services/types";
import { createTreeService } from "../../services/treeService";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: TreeState = {
  data: null,
  layers: [],
  currentPath: null,
};

const importChildNode = (node: DataNode) => {
  const { type } = node;
  let name = null;
  if (type === "folder" || type === "leaf") {
    name = node.name;
  }
  return { type, name };
};

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    initializeWithData: (state, action: PayloadAction<DataNode[]>) => {
      state.data = action.payload;
      const service = createTreeService(state.data, "");
      const items = service.getItems();
      const childrenNodes = items.map(importChildNode);

      const firstItem = createTreeService(state.data, childrenNodes[0].name!);
      const content = firstItem.getContent();

      state.layers = [
        {
          path: "",
          currentName: childrenNodes[0].name,
          childrenNodes,
          content,
        },
      ];

      state.currentPath = "";
    },
    nextItem: (state, action: PayloadAction<string>) => {
      const currentName = action.payload;

      const lastLayer = state.layers[state.layers.length - 1];
      const index = lastLayer.childrenNodes.findIndex(
        (node) => node.name === currentName,
      );
      if (index < lastLayer.childrenNodes.length - 1) {
        const ni = lastLayer.childrenNodes[index + 1];
        lastLayer.currentName = ni.name;
      }
    },
    prevItem: (state, action: PayloadAction<string>) => {
      const currentName = action.payload;
      const lastLayer = state.layers[state.layers.length - 1];
      const index = lastLayer.childrenNodes.findIndex(
        (node) => node.name === currentName,
      );
      if (index > 0) {
        const pi = lastLayer.childrenNodes[index - 1];
        lastLayer.currentName = pi.name;
      }
    },
    selectItem: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      const service = createTreeService(state.data, state.currentPath);
      const newPath = service.navigateTo(name);

      if (newPath) {
        const service = createTreeService(state.data, newPath);
        const lastLayer = state.layers[state.layers.length - 1];
        lastLayer.currentName = name;
        lastLayer.content = service.getContent();
      }
    },
    navigateInto: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      const service = createTreeService(state.data, state.currentPath);
      const newPath = service.navigateTo(name);

      if (newPath) {
        const service = createTreeService(state.data, newPath);
        const childrenNodes = service.getItems().map(importChildNode);

        // select first item
        const firstChildName = childrenNodes[0].name;
        const firstChildPath = service.navigateTo(firstChildName);

        // extract content from first item
        const contentService = createTreeService(state.data, firstChildPath);

        const newLayer = {
          path: newPath,
          currentName: firstChildName,
          childrenNodes,
          content: contentService.getContent(),
        };

        // push new layer
        state.layers.push(newLayer);
      }
    },
    navigateUp: (state) => {
      // remove last layer
      if (state.layers.length > 1) {
        state.layers.pop();
      }
    },
  },
  selectors: {
    getContent: (state) => {
      if (state.layers.length) {
        return state.layers[state.layers.length - 1].content;
      }
      return null;
    },
    getLayers: (state) => {
      return state.layers.slice(-2);
    },
  },
});
