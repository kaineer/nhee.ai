import { markdown } from "markdown";
import type { DataNode, LeafNode, RootNode } from "./types";

const getSubItem = (item: DataNode, name: string) => {
  const { type } = item;
  if (["root", "folder"].includes(type)) {
    const { children } = item;
    return (children || []).find((it: DataNode) => it.name === name) || void 0;
  }
  return void 0;
};

const findItem = (root: DataNode, path: string): DataNode | undefined => {
  let item = root;
  const parts = path.split("/").filter((part) => part.trim() != "");
  parts.some((part) => {
    item = getSubItem(item, part);
    return typeof item === "undefined";
  });
  return item;
};

export const createDataService = (data: DataNode[], path: string) => {
  const root: RootNode = { type: "root", children: data };
  const item: DataNode | undefined = findItem(root, path);

  const getType = () => {
    return item ? item.type : "none";
  };

  const getItems = (): DataNode[] => {
    return item && ["folder", "root"].includes(item.type) ? item.children : [];
  };

  const getContent = (): string | undefined => {
    if (!item) return void 0;

    const { type = "none" } = item;
    if (type === "leaf") {
      const { contentType = "html", content = "" } = item as LeafNode;
      if (contentType === "html") return content;
      if (contentType === "markdown") {
        return markdown.toHTML(content);
      }
    }
    return void 0;
  };

  return {
    getType,
    getItems,
    getContent,
  };
};
