import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { Container } from "./components/ui/front/Container/Container";
import { Search } from "./components/ui/search/Search/Search";
import { Tag } from "./components/ui/tag/Tag/Tag.tsx";
import { Tree } from "./components/ui/tree/Tree/Tree.tsx";

function App() {
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
}

export default App;
