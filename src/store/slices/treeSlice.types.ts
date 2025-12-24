import type { DataNode } from "src/services/types";

type TreeNodeType = "leaf" | "folder";

interface BaseTreeNode {
  type: TreeNodeType;
  name: string;
}

interface LeafTreeNode extends BaseTreeNode {
  content: string;
}

interface FolderTreeNode extends BaseTreeNode {
  children: TreeNode[];
}

type TreeNode = FolderTreeNode | LeafTreeNode;

export interface TreeLayer {
  path: string;
  content?: string;
  currentName: string | null;
  childrenNodes: BaseTreeNode[];
}

export interface TreeState {
  data: null | DataNode[];
  layers: TreeLayer[];
  currentPath: string | null;
}
