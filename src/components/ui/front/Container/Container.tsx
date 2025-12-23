import { useEffect, useRef } from "react";
import { Part } from "../Part/Part";
import { type SymbolType } from "../Symbol/types";
import classes from "./Container.module.css";
import { useNavigate } from "react-router";

interface PartData {
  symbolType: SymbolType;
  index: number;
  path: string;
}

export const Container = () => {
  const navigate = useNavigate();

  const handleExpand = (path: string) => () => navigate(path);

  const parts: PartData[] = [
    { symbolType: "search", index: 0, path: "/search" },
    { symbolType: "tag", index: 1, path: "/tag" },
    { symbolType: "tree", index: 2, path: "/tree" },
  ];

  const ref = useRef(null);

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
      ref={ref}
      className={classes.container}
      role="main"
      aria-label="Three section layout"
    >
      {parts.map(({ symbolType, index, path }) => (
        <Part
          key={symbolType}
          symbolType={symbolType}
          index={index}
          onExpanded={handleExpand(path)}
        />
      ))}
    </div>
  );
};
