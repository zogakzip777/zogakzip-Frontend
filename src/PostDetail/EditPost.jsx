import React from 'react';
import './EditPost.css';

const EditPost = ({ postId, onClose }) => {
  return (
    <div className="edit-post-modal">
      <h2>추억 수정하기</h2>
      {/* Add form fields for editing the post */}
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default EditPost;