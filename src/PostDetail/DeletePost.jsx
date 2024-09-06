import React, { useState } from "react";
import "./DeletePost.css";

const DeletePost = ({ postId, onClose, onDelete }) => {
  const [password, setPassword] = useState("");

  const handleDelete = async () => {
    try {
      const verifyResponse = await fetch(
        `/api/posts/${postId}/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!verifyResponse.ok) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      const deleteResponse = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postPassword: password }),
      });

      if (!deleteResponse.ok) {
        throw new Error("게시물 삭제에 실패했습니다.");
      }

      onDelete();
      onClose();
      alert("게시물이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.message);
    }
  };

  return (
    <div className="delete-post-modal">
      <div className="modal-header">
        <h2>추억 삭제</h2>
        <button className="close-button" onClick={onClose}>
          <img src="/public/iconpng/icon=x.png" alt="Close" />
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
      <button className="delete-button" onClick={handleDelete}>
        삭제하기
      </button>
    </div>
  );
};

export default DeletePost;
