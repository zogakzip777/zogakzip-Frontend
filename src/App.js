import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GroupListPage from "./GroupList/GroupListPage";
import CombinedPage from "./그룹상세조회/CombinedPage"; // CombinedPage를 import합니다.
import PostDetail from "./PostDetail/PostDetail"; // 새로 추가

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupListPage />} />
        <Route path="/group/:groupId" element={<CombinedPage />} />{" "}
        {/* 두 페이지를 합친 컴포넌트 */}
        <Route path="/post/:postId" element={<PostDetail />} />{" "}
        {/* 새로 추가한 라우트 */}
      </Routes>
    </Router>
  );
}

export default App;
