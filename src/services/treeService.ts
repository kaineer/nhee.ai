import { markdown } from "markdown";
import type { DataNode, FolderNode, LeafNode, Named, RootNode } from "./types";

const getSubItem = (item: DataNode, name: string): DataNode | undefined => {
  if (!item) return void 0;

  const { type } = item;
  if (["root", "folder"].includes(type)) {
    const { children } = item as FolderNode;
    const hasName = (it: DataNode) => (it as Named).name === name;
    return (children || []).find(hasName) || void 0;
  }
  return void 0;
};

const joinPath = (currentPath: string, subPath: string): string => {
  if (currentPath.endsWith("/")) {
    return currentPath + subPath;
  }
  return currentPath + "/" + subPath;
};

const findItem = (root: DataNode, path: string): DataNode | undefined => {
  let item: DataNode | undefined = root;
  const parts = path.split("/").filter((part) => part.trim() != "");
  parts.some((part) => {
    if (typeof item !== "undefined") {
      item = getSubItem(item, part);
    }
    return typeof item === "undefined";
  });
  return item;
};

export const createTreeService = (data: DataNode[], path: string) => {
  const root: RootNode = { type: "root", children: data };
  const item: DataNode | undefined = findItem(root, path);

  const getType = () => {
    return item ? item.type : "none";
  };

  const getItems = (): DataNode[] => {
    return item && ["folder", "root"].includes(item.type)
      ? (item as FolderNode).children
      : [];
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

  const navigateTo = (subName: string): string | null => {
    const trimmedSubName = subName.trim();
    const subItem = getSubItem(item, trimmedSubName);
    return subItem ? joinPath(path, trimmedSubName) : null;
  };

  return {
    getType,
    getItems,
    getContent,
    navigateTo,
  };
};
