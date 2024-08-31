//App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GroupList from "./GroupPage";
import MemoryPage from "./MemoryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupList />} />
        <Route path="/memory/:groupId" element={<MemoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
