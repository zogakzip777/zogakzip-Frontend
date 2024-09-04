import React, { useState, useEffect, useCallback } from 'react';
import './Comments.css';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: '', content: '', password: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('댓글을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      if (!response.ok) throw new Error('Failed to post comment');
      setNewComment({ author: '', content: '', password: '' });
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleEdit = async (commentId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: prompt('비밀번호를 입력하세요') }),
      });
      if (!response.ok) throw new Error('Password verification failed');
      const commentToEdit = comments.find(c => c.id === commentId);
      setEditingComment(commentToEdit);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error verifying password:', error);
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/comments/${editingComment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingComment),
      });
      if (!response.ok) throw new Error('Failed to update comment');
      setIsModalOpen(false);
      setEditingComment(null);
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const password = prompt('댓글 삭제를 위해 비밀번호를 입력하세요');
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error('Failed to delete comment');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('댓글 삭제에 실패했습니다. 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="comments-section">
      <h3>댓글</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="닉네임"
          value={newComment.author}
          onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
          required
        />
        <textarea
          placeholder="댓글을 입력하세요..."
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={newComment.password}
          onChange={(e) => setNewComment({ ...newComment, password: e.target.value })}
          required
        />
        <button type="submit">댓글 등록</button>
      </form>
      <div className="comments-list">
        {loading ? (
          <p>댓글을 불러오는 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span>{comment.author}</span>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p>{comment.content}</p>
              <div className="comment-actions">
                <button onClick={() => handleEdit(comment.id)}>수정</button>
                <button onClick={() => handleDelete(comment.id)}>삭제</button>
              </div>
            </div>
          ))
        ) : (
          <p>아직 댓글이 없습니다.</p>
        )}
      </div>
      {isModalOpen && (
        <div className="edit-modal">
          <textarea
            value={editingComment.content}
            onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
          />
          <button onClick={handleUpdate}>수정 완료</button>
          <button onClick={() => setIsModalOpen(false)}>취소</button>
        </div>
      )}
    </div>
  );
};

export default Comments;