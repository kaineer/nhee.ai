import classes from "./Layer.module.css";
import { type TreeLayer } from "../../../../store/slices/treeSlice.types";
import { treeSlice } from "../../../../store/slices/treeSlice";
import clsx from "clsx";
import { useEffect, type KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  layerIndex: number;
  last: boolean;
}

export const Layer = ({ layerIndex, last }: Props) => {
  const { nextItem, prevItem, navigateInto, navigateUp } = treeSlice.actions;
  const { getLayers } = treeSlice.selectors;
  const dispatch = useDispatch();
  const layers = useSelector(getLayers);
  const layer = layers[layerIndex];
  const items = layer.childrenNodes;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (last) {
        if (e.code === "KeyJ") {
          dispatch(nextItem(layer.currentName));
        } else if (e.code === "KeyK") {
          dispatch(prevItem(layer.currentName));
        } else if (e.code === "KeyL") {
          dispatch(navigateInto(layer.currentName));
        } else if (e.code === "KeyH") {
          dispatch(navigateUp());
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, last, layers, layer.currentName, nextItem, prevItem]);

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        {items.map((item, index) => (
          <div
            key={index}
            className={clsx(classes.listItem, {
              [classes.selected]: item.name === layer.currentName,
            })}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
