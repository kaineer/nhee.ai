import { useEffect } from "react";
import { Part } from "../Part/Part";
import { type SymbolType } from "../Symbol/types";
import classes from "./Container.module.css";

interface PartData {
  symbolType: SymbolType;
  index: number;
}

export const Container = () => {
  const parts: PartData[] = [
    { symbolType: "search", index: 0 },
    { symbolType: "tag", index: 1 },
    { symbolType: "tree", index: 2 },
  ];

  useEffect(() => {
    const symbols = document.querySelectorAll("[data-slug]");

    symbols.forEach((s) => {
      (s as HTMLElement).style.transition = "none";
    });

    const timeoutId = setTimeout(() => {
      symbols.forEach((s) => {
        (s as HTMLElement).style.transition = "all 0.3s ease";
      });
    }, 600);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={classes.container}
      role="main"
      aria-label="Three section layout"
    >
      {parts.map(({ symbolType, index }) => (
        <Part key={symbolType} symbolType={symbolType} index={index} />
      ))}
    </div>
  );
};
