import {
  type BaseTreeNode,
  type TreeLayer,
  type TreeState,
} from "./treeSlice.types";
import { type DataNode } from "../../services/types";
import { createTreeService } from "../../services/treeService";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: TreeState = {
  data: null,
  layers: [],
  currentPath: null,
};

const importChildNode = (node: DataNode): BaseTreeNode | null => {
  const { type } = node;
  if (type === "folder" || type === "leaf") {
    return { type, name: node.name };
  }
  return null;
};

const getLastLayer = (state: TreeState) =>
  state.layers.length ? state.layers[state.layers.length - 1] : null;

const selectItemInLayer = (
  data: DataNode[],
  layer: TreeLayer | null,
  params:
    | {
        currentName: string | null;
        delta: -1 | 1;
      }
    | { currentName: string; newName: string },
) => {
  const createService = (path: string) => createTreeService(data, path);
  const { currentName } = params;

  if (!layer) return;

  const navigateByName = (name: string) => {
    const currentPath = layer.path;
    const service = createService(currentPath);
    const newPath = service.navigateTo(name);

    if (newPath) {
      const service = createService(newPath);
      layer.currentName = name;
      layer.content = service.getContent();
    }
  };

  if (currentName) {
    if ("delta" in params) {
      const { delta } = params;
      const { childrenNodes } = layer;
      const index = childrenNodes.findIndex(
        (node) => node.name === currentName,
      );
      if (index === -1) return;
      if (
        (delta === 1 && index < childrenNodes.length - 1) ||
        (delta === -1 && index > 0)
      ) {
        const newItem = childrenNodes[index + delta];
        navigateByName(newItem.name);
      }
    } else if ("newName" in params && params.newName) {
      const { newName } = params;
      navigateByName(newName);
    }
  }
};

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    initializeWithData: (state, action: PayloadAction<DataNode[]>) => {
      state.data = action.payload;
      const service = createTreeService(state.data, "");
      const items = service.getItems();
      const childrenNodes: BaseTreeNode[] = items
        .map(importChildNode)
        .filter((obj) => obj !== null);

      const firstItem = createTreeService(state.data, childrenNodes[0].name);
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
    nextItem: (state, action: PayloadAction<string | null>) => {
      selectItemInLayer(state.data || [], getLastLayer(state), {
        currentName: action.payload,
        delta: 1,
      });
    },
    prevItem: (state, action: PayloadAction<string>) => {
      selectItemInLayer(state.data || [], getLastLayer(state), {
        currentName: action.payload,
        delta: -1,
      });
    },
    selectItem: (state, action: PayloadAction<string>) => {
      const newName = action.payload;

      if (newName) {
        const lastLayer = state.layers[state.layers.length - 1];
        const currentPath = lastLayer.path;
        const service = createTreeService(state.data, currentPath);
        const newPath = service.navigateTo(newName);

        if (newPath) {
          const service = createTreeService(state.data, newPath);
          const lastLayer = state.layers[state.layers.length - 1];
          lastLayer.currentName = newName;
          lastLayer.content = service.getContent();
        }
      }
    },
    navigateInto: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      const lastLayer = state.layers[state.layers.length - 1];
      const service = createTreeService(state.data, lastLayer.path);
      const newPath = service.navigateTo(name);

      if (newPath) {
        const service = createTreeService(state.data, newPath);
        const childrenNodes = service
          .getItems()
          .map(importChildNode)
          .filter((obj) => obj !== null);

        if (childrenNodes.length) {
          // select first item
          const firstChildName = childrenNodes[0].name;
          const firstChildPath = service.navigateTo(firstChildName);

          // extract content from first item
          const contentService = createTreeService(state.data, firstChildPath);

          const newLayer: TreeLayer = {
            path: newPath,
            content: contentService.getContent(),
            currentName: firstChildName,
            childrenNodes,
          };

          // push new layer
          state.layers.push(newLayer);
        }
      }
    },
    navigateUp: (state) => {
      // remove last layer
      if (state.layers.length > 1) {
        state.layers.pop();
      }
    },
    setCurrentLayer: (state, action: PayloadAction<number>) => {
      const layerIndex = action.payload;
      const layers = state.layers;

      if (layers.length > 1) {
        if (layerIndex === 0) {
          layers.pop();
        }
      }
    },
  },
  selectors: {
    getContent: (state) => {
      const lastLayer = getLastLayer(state);
      if (lastLayer) {
        return lastLayer.content;
      }
      return null;
    },
    getNodeType: (state) => {
      const lastLayer = getLastLayer(state);
      if (lastLayer) {
        const item = lastLayer.childrenNodes.find(
          (it) => it.name === lastLayer.currentName,
        );
        return item.type;
      }
      return "none";
    },
    getLayers: (state) => {
      return state.layers.slice(-2);
    },
  },
});
