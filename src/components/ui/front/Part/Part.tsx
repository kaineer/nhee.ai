/* import components */
import { useRef, useState } from "react";
import { Symbol } from "../Symbol/Symbol";
import type { SymbolType } from "../Symbol/types";
import { FlipAnimation } from "@shared/animations/FlipAnimation";

/* import classes */
import classes from "./Part.module.css";
import clsx from "clsx";

interface Props {
  symbolType: SymbolType;
  index: number;
  onExpanded?: () => void;
}

export const Part = ({ symbolType, index, onExpanded }: Props) => {
  const partClasses = [classes.part1, classes.part2, classes.part3];
  const partAriaLabels = ["Tag section", "Search section", "Tree section"];

  const partClass = partClasses[index] || classes.part1;
  const partAriaLabel = partAriaLabels[index] || "Section";

  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsAnimating(true);
  };

  const animationComplete = () => {
    setIsAnimating(false);
    onExpanded?.();
  };

  return (
    <>
      <div
        ref={ref}
        className={clsx(classes.part, partClass)}
        tabIndex={0}
        aria-label={partAriaLabel}
        data-part-index={index}
        onClick={handleClick}
      >
        <Symbol type={symbolType} />
      </div>

      {isAnimating && ref.current && (
        <FlipAnimation
          from={ref.current}
          to={ref.current.parentElement!}
          onAnimationComplete={animationComplete}
          duration={500}
        />
      )}
    </>
  );
};
