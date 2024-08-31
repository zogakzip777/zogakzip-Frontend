import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupListPage from './GroupListPage';
import GroupDetailPage from './GroupDetailPage'; // 그룹 상세 페이지 컴포넌트

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupListPage />} />
        <Route path="/group/:id" element={<GroupDetailPage />} />  {/* 그룹 상세 페이지 */}
      </Routes>
    </Router>
  );
}

export default App;


