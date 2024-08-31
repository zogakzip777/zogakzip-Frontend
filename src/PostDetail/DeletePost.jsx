import React from 'react';
import './DeletePost.css';

const DeletePost = ({ postId, onClose }) => {
  return (
    <div className="delete-post-modal">
      <h2>추억 삭제하기</h2>
      <p>정말로 이 추억을 삭제하시겠습니까?</p>
      <button onClick={() => {/* Add delete logic */}}>삭제</button>
      <button onClick={onClose}>취소</button>
    </div>
  );
};

export default DeletePost;