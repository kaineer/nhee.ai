import classes from "./Tree.module.css";

import { useSelector } from "react-redux";
import { Layer } from "../Layer/Layer";
import { treeSlice } from "@slices/treeSlice";
import { Content } from "../Content/Content";

export const Tree = () => {
  const { getLayers } = treeSlice.selectors;
  const layers = useSelector(getLayers);

  return (
    <div className={classes.container}>
      {layers.map((l, i) => (
        <Layer key={i} last={i === layers.length - 1} layerIndex={i} />
      ))}
      <Content />
    </div>
  );
};
