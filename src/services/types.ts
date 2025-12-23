interface Timestamps {
  createdAt: string;
  updatedAt?: string;
}

// type NodeType = "root" | "folder" | "leaf" | "none";
type ContentType = "markdown" | "html";

export interface FolderNode extends Timestamps {
  type: "folder";
  name: string;
  children: DataNode[];
}

export interface LeafNode extends Timestamps {
  type: "leaf";
  name: string;
  contentType: ContentType;
  tags: string[];
  content: string;
}

export interface RootNode {
  type: "root";
  children: DataNode[];
}

export type DataNode = RootNode | FolderNode | LeafNode;
