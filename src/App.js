import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GroupListPage from "./GroupList/GroupListPage";
import GroupPage from "./그룹상세조회/GroupPage";
import MemoryPage from "./그룹상세조회/MemoryPage";
import PostDetail from "./PostDetail/PostDetail"; // 새로 추가

function CombinedPage({ id }) {
  return (
    <div>
      <GroupPage id={id} />
      <MemoryPage groupId={id} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupListPage />} />
        <Route path="/group/:id" element={<CombinedPage />} />{" "}
        {/* 두 페이지를 합친 컴포넌트 */}
        <Route path="/post/:postId" element={<PostDetail />} />{" "}
        {/* 새로 추가한 라우트 */}
      </Routes>
    </Router>
  );
}

export default App;
