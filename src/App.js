import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupListPage from './GroupList/GroupListPage';
import GroupDetailPage from './GroupDetailPage'; // 그룹 상세 페이지 컴포넌트
import GroupPage from './그룹상세조회/GroupPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupListPage />} />
        <Route path="/group/:id" element={<GroupPage />} />  {/* 그룹 상세 페이지 */}
      </Routes>
    </Router>
  );
}

export default App;


