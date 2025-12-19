/* import components */
import { Symbol } from "../Symbol/Symbol";
import type { SymbolType } from "../Symbol/types";

/* import classes */
import classes from "./Part.module.css";
import clsx from "clsx";

interface Props {
  symbolType: SymbolType;
  index: number;
}

export const Part = ({ symbolType, index }: Props) => {
  const partClasses = [classes.part1, classes.part2, classes.part3];
  const partAriaLabels = ["Tag section", "Search section", "Tree section"];

  const partClass = partClasses[index] || classes.part1;
  const partAriaLabel = partAriaLabels[index] || "Section";

  return (
    <div
      className={clsx(classes.part, partClass)}
      tabIndex={0}
      aria-label={partAriaLabel}
      data-part-index={index}
    >
      <Symbol type={symbolType} />
    </div>
  );
};
