// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GroupListPage from "./GroupList/GroupListPage";
import CombinedPage from "./그룹상세조회/CombinedPage";
import PostDetail from "./PostDetail/PostDetail";
import UploadMemoryPage from "./그룹상세조회/UploadMemoryPage"; // UploadMemory 컴포넌트를 임포트합니다.
import PasswordVerification from "./그룹상세조회/PasswordVerification";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupListPage />} />
        <Route path="/group/:groupId" element={<CombinedPage />} />
        <Route
          path="/upload-memory/:groupId"
          element={<UploadMemoryPage />}
        />{" "}
        <Route
          path="/password-verification/:postId"
          element={<PasswordVerification />}
        />
        <Route path="/post/:postId" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
