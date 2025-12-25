import { BrowserRouter, Route, Routes } from "react-router";
import { Container } from "./components/ui/front/Container/Container";
import { Search } from "./components/ui/search/Search/Search";
import { Tag } from "./components/ui/tag/Tag/Tag.tsx";
import { Tree } from "./components/ui/tree/Tree/Tree.tsx";
import { setupStore } from "./store/index.ts";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { treeSlice } from "@slices/treeSlice.ts";
import data from "./data/data.json";

const store = setupStore();

const AppContent = () => {
  const { initializeWithData } = treeSlice.actions;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeWithData(data));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Container />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tag" element={<Tag />} />
        <Route path="/tree" element={<Tree />} />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
