interface Timestamps {
  createdAt: string;
  updatedAt?: string;
}

// type NodeType = "root" | "folder" | "leaf" | "none";
type ContentType = "markdown" | "html";

export interface Named {
  name: string;
}

export interface RootNode {
  type: "root";
  children: DataNode[];
}

export interface FolderNode extends Timestamps, Named {
  type: "folder";
  children: DataNode[];
}

export interface LeafNode extends Timestamps, Named {
  type: "leaf";
  contentType: ContentType;
  tags: string[];
  content: string;
}

export type DataNode = RootNode | FolderNode | LeafNode;
