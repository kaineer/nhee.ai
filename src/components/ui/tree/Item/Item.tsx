import classes from "./Item.module.css";
import clsx from "clsx";

interface Props {
  name: string;
  current: boolean;
  onClick: () => void;
}

export const Item = ({ name, current, onClick }: Props) => {
  return (
    <div
      className={clsx(classes.listItem, {
        [classes.selected]: current,
      })}
      onClick={onClick}
    >
      {name}
    </div>
  );
};
