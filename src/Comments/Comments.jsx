import React, { useState } from 'react';
import './Comments.css';

const Comments = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: '사용자1', time: '1시간 전', content: '멋진 추억이네요!' },
    { id: 2, author: '사용자2', time: '30분 전', content: '저도 가보고 싶어요.' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to submit the comment
    setNewComment('');
  };

  return (
    <div className="comments-section">
      <h3>댓글</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
        />
        <button type="submit">댓글 등록</button>
      </form>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <span>{comment.author}</span>
              <span>{comment.time}</span>
            </div>
            <p>{comment.content}</p>
            <div className="comment-actions">
              <button><img src="/icon-edit.png" alt="Edit" /></button>
              <button><img src="/icon-delete.png" alt="Delete" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;