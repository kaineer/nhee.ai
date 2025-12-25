import { useSelector } from "react-redux";
import { treeSlice } from "../../../../store/slices/treeSlice";
import { FolderPlaceholder } from "../FolderPlaceholder/FolderPlaceholder";

export const Content = () => {
  const { getContent, getNodeType } = treeSlice.selectors;
  const content = useSelector(getContent);
  const nodeType = useSelector(getNodeType);

  if (nodeType === "leaf") {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content || "<p>Nothing found</p>" }}
      />
    );
  } else {
    return <FolderPlaceholder />;
  }
};
