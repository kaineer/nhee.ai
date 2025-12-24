import classes from "./Tree.module.css";

import { useSelector } from "react-redux";
import { Layer } from "../Layer/Layer";
import { treeSlice } from "../../../../store/slices/treeSlice";

export const Tree = () => {
  const { getLayers } = treeSlice.selectors;
  const layers = useSelector(getLayers);

  return (
    <>
      {layers.map((l, i) => (
        <Layer key={i} last={i === layers.length - 1} layerIndex={i} />
      ))}
    </>
  );
};
