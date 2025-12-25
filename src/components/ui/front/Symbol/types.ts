export type SymbolType = "tag" | "search" | "tree";

export const navigationSymbols: Record<SymbolType, string> = {
  tag: "#",
  search: "/",
  tree: ".",
} as const;

export const navigationKeys: Record<SymbolType, string> = {
  tag: "Digit3",
  search: "Slash",
  tree: "Period",
} as const;
