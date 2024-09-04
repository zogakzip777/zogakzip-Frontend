import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <img src="/404.png" alt="Page Not Found" style={{ maxWidth: '100%', height: 'auto' }} />
      <h1>찾을 수 없는 페이지입니다.</h1>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
};

export default NotFoundPage;