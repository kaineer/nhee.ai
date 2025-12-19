export type SymbolType = "tag" | "search" | "tree";

export const navigationSymbols: Record<SymbolType, string> = {
  tag: "#",
  search: "/",
  tree: ".",
} as const;
