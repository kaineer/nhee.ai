import { configureStore } from "@reduxjs/toolkit";
import { treeSlice } from "./slices/treeSlice";

export function setupStore() {
  const store = configureStore({
    reducer: {
      [treeSlice.reducerPath]: treeSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
}
