import React from 'react';
import { useParams } from 'react-router-dom';

function GroupDetailPage() {
  const { groupId } = useParams();

  // 여기에서 groupId를 사용하여 그룹 데이터를 가져오고 표시할 수 있습니다.
  return (
    <div>
      <h1>그룹 상세 페이지</h1>
      <p>그룹 ID: {groupId}</p>
      {/* 그룹의 상세 정보 표시 */}
    </div>
  );
}

export default GroupDetailPage;

//edi