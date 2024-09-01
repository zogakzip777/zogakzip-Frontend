import React, { useState } from 'react';
import './DeletePost.css';

const DeletePost = ({ postId, onClose, onDelete }) => {
  const [password, setPassword] = useState('');

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
        onDelete();
        onClose();
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('추억 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="delete-post-modal">
      <div className="modal-header">
        <h2>추억 삭제</h2>
        <button className="close-button" onClick={onClose}>
          <img src="/public/iconpng/icon-x.png" alt="Close" />
        </button>
      </div>
      <div className="modal-content">
        <label htmlFor="password">삭제 권한 인증</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="추억 비밀번호를 입력해 주세요"
        />
      </div>
      <button className="delete-button" onClick={handleDelete}>삭제하기</button>
    </div>
  );
};

export default DeletePost;