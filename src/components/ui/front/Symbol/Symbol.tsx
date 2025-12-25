/* import react */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

/* import types */
import { type SymbolType, navigationSymbols, navigationKeys } from "./types";

/* import classes */
import classes from "./Symbol.module.css";

/* import utils */
import { px } from "@shared/dom";

interface Props {
  type: SymbolType;
}

export const Symbol = ({ type }: Props) => {
  const symbolRef = useRef<HTMLDivElement>(null);
  const navigationSymbol = navigationSymbols[type];
  const navigationKey = navigationKeys[type];

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.code === navigationKey) {
        navigate("/" + type);
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [navigate, navigationKey, type]);

  useEffect(() => {
    const updateSize = () => {
      const symbol = symbolRef.current;
      if (!symbol) return;

      const part = symbol.parentElement;
      if (!part) return;

      const partWidth = part.clientWidth;
      const partHeight = part.clientHeight;

      const minSide = Math.min(partWidth, partHeight);
      const size = minSide * 0.4;

      Object.assign(symbol.style, {
        width: px(size),
        height: px(size),
        fontSize: px(size * 0.8),
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <div ref={symbolRef} className={classes.symbol} data-slug={type}>
      {navigationSymbol}
    </div>
  );
};
