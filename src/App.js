import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GroupListPage from "./GroupList/GroupListPage";
import GroupPage from "./그룹상세조회/GroupPage";
import MemoryPage from "./그룹상세조회/MemoryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupListPage />} />
        <Route path="/group/:id" element={<GroupPage />} />{" "}
        {/* 그룹 상세 페이지 */}
        <Route path="/memory/:groupId" element={<MemoryPage />} />{" "}
        {/* 추억게시물 */}
      </Routes>
    </Router>
  );
}

export default App;
