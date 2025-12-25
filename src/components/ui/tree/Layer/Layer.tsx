import classes from "./Layer.module.css";
import { treeSlice } from "../../../../store/slices/treeSlice";
import clsx from "clsx";
import { useEffect, type KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

interface Props {
  layerIndex: number;
  last: boolean;
}

export const Layer = ({ layerIndex, last }: Props) => {
  const {
    nextItem,
    prevItem,
    selectItem,
    navigateInto,
    navigateUp,
    setCurrentLayer,
  } = treeSlice.actions;

  const { getLayers } = treeSlice.selectors;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const layers = useSelector(getLayers);
  const layer = layers[layerIndex];
  const items = layer.childrenNodes;

  const handleClick = (name: string) => () => {
    dispatch(setCurrentLayer(layerIndex));
    dispatch(selectItem(name));
  };

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
          if (layers.length === 1) {
            navigate("/");
          } else {
            dispatch(navigateUp());
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    dispatch,
    last,
    layers,
    layer.currentName,
    nextItem,
    prevItem,
    navigateInto,
    navigateUp,
  ]);

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        {items.map((item, index) => (
          <div
            key={index}
            className={clsx(classes.listItem, {
              [classes.selected]: item.name === layer.currentName,
            })}
            onClick={handleClick(item.name)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
