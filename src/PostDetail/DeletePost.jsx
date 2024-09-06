import React, { useState } from 'react';
import './DeletePost.css';

const DeletePost = ({ postId, onClose, onDelete }) => {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '게시글 삭제에 실패했습니다.');
      }

      onDelete();
      onClose();
      alert('게시글이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content delete-post-modal">
        <h2>게시글 삭제</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
          <label>
            삭제 권한 인증:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요"
            />
          </label>
          <div className="button-container">
            <button type="submit" disabled={isDeleting}>
              {isDeleting ? '삭제 중...' : '삭제하기'}
            </button>
            <button type="button" onClick={onClose}>닫기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeletePost;