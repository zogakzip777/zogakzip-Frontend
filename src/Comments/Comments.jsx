import React, { useState, useEffect, useCallback } from "react";
import "./Comments.css";

const CommentModal = ({ isOpen, onClose, onSubmit }) => {
  const [newComment, setNewComment] = useState({
    nickname: "",
    content: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newComment);
    setNewComment({ nickname: "", content: "", password: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="comment-modal">
      <div className="modal-content">
        <h2>댓글 등록</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력해 주세요"
              value={newComment.nickname}
              onChange={(e) =>
                setNewComment({ ...newComment, nickname: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>댓글</label>
            <textarea
              placeholder="댓글을 입력해 주세요"
              value={newComment.content}
              onChange={(e) =>
                setNewComment({ ...newComment, content: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>비밀번호 생성</label>
            <input
              type="password"
              placeholder="댓글 비밀번호를 생성해 주세요"
              value={newComment.password}
              onChange={(e) =>
                setNewComment({ ...newComment, password: e.target.value })
              }
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-button">
              등록하기
            </button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/posts/${postId}/comments?page=${currentPage}&pageSize=10`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(Array.isArray(data.data) ? data.data : []); // 여기를 수정했습니다.
      setError(null);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("댓글을 불러오는 데 실패했습니다.");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId, currentPage]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (newComment) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post comment");
      }
      const postedComment = await response.json();
      setComments(prevComments => Array.isArray(prevComments) ? [postedComment, ...prevComments] : [postedComment]);
      setIsModalOpen(false);
      alert("댓글이 등록되었습니다.");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert(`댓글 등록에 실패했습니다: ${error.message}`);
    }
  };

  const handleEdit = async (commentId) => {
    try {
      const password = prompt("비밀번호를 입력하세요");
      const response = await fetch(
        `/api/comments/${commentId}/verify-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      if (!response.ok) throw new Error("Password verification failed");
      const commentToEdit = comments.find((c) => c.id === commentId);
      setEditingComment(commentToEdit);
    } catch (error) {
      console.error("Error verifying password:", error);
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleUpdate = async (updatedComment) => {
    try {
      const response = await fetch(`/api/comments/${updatedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedComment),
      });
      if (!response.ok) throw new Error("Failed to update comment");
      const updatedCommentData = await response.json();
      setComments(prevComments =>
        Array.isArray(prevComments)
          ? prevComments.map(comment =>
              comment.id === updatedCommentData.id ? updatedCommentData : comment
            )
          : [updatedCommentData]
      );
      setEditingComment(null);
      alert("댓글이 수정되었습니다.");
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const password = prompt("댓글 삭제를 위해 비밀번호를 입력하세요");
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error("Failed to delete comment");
      setComments(prevComments => 
        Array.isArray(prevComments)
          ? prevComments.filter(comment => comment.id !== commentId)
          : []
      );
      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("댓글 삭제에 실패했습니다. 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>댓글</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="add-comment-button"
        >
          댓글 등록
        </button>
      </div>
      <div className="comments-list">
        {loading ? (
          <p>댓글을 불러오는 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.nickname}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="comment-content">{comment.content}</p>
              <div className="comment-actions">
                <button onClick={() => handleEdit(comment.id)}>
                  <img src="/public/iconpng/icon=edit.png" alt="Edit" />
                  수정
                </button>
                <button onClick={() => handleDelete(comment.id)}>
                  <img src="/public/iconpng/icon=x.png" alt="Delete" />
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>아직 댓글이 없습니다.</p>
        )}
      </div>
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
      {editingComment && (
        <div className="edit-comment-modal">
          <div className="modal-content">
            <h2>댓글 수정</h2>
            <textarea
              value={editingComment.content}
              onChange={(e) =>
                setEditingComment({
                  ...editingComment,
                  content: e.target.value,
                })
              }
            />
            <div className="modal-actions">
              <button onClick={() => handleUpdate(editingComment)}>
                수정 완료
              </button>
              <button onClick={() => setEditingComment(null)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;