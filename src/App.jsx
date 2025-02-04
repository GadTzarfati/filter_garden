import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TreeViewPage from "./pages/TreeViewPage";

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Filter Garden</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tree-view" element={<TreeViewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
