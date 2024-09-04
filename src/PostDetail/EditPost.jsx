import React, { useState, useEffect } from "react";
import "./EditPost.css";

const EditPost = ({ post, onClose, onEdit }) => {
  const [editedPost, setEditedPost] = useState(post);
  const [newImage, setNewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setNewImage(e.target.files[0]);
    } else {
      setEditedPost((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setEditedPost((prev) => ({
        ...prev,
        tags: [...prev.tags, e.target.value],
      }));
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in editedPost) {
        if (key === "tags") {
          formData.append(key, JSON.stringify(editedPost[key]));
        } else if (key !== "image") {
          formData.append(key, editedPost[key]);
        }
      }
      if (newImage) {
        formData.append("image", newImage);
      }

      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update post");
      const updatedPost = await response.json();
      onEdit(updatedPost);
      alert('게시물이 수정되었습니다.');
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      alert('게시물 수정에 실패했습니다.');
    }
  };

  return (
    <div className="edit-post-modal">
      <div className="modal-header">
        <h2>추억 수정</h2>
        <button className="close-button" onClick={onClose}>
          <img src="/iconpng/icon-x.png" alt="Close" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-content">
          <div className="form-left">
            <div className="form-group">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={editedPost.nickname}
                onChange={handleInputChange}
                placeholder="닉네임을 입력해 주세요"
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editedPost.title}
                onChange={handleInputChange}
                placeholder="제목을 입력해 주세요"
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">이미지</label>
              <div className="file-input-wrapper">
                <input
                  type="text"
                  readOnly
                  value={newImage ? newImage.name : (editedPost.image ? editedPost.image.name : "")}
                  placeholder="파일을 선택해 주세요"
                />
                <label className="file-input-label">
                  파일 선택
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleInputChange}
                    hidden
                  />
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="content">본문</label>
              <textarea
                id="content"
                name="content"
                value={editedPost.content}
                onChange={handleInputChange}
                placeholder="본문 내용을 입력해 주세요"
              />
            </div>
          </div>
          <div className="form-right">
            <div className="form-group">
              <label htmlFor="tags">태그</label>
              <input
                type="text"
                id="tags"
                onKeyPress={handleTagInput}
                placeholder="태그를 입력 후 Enter"
              />
              <div className="tags-container">
                {editedPost.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="location">장소</label>
              <input
                type="text"
                id="location"
                name="location"
                value={editedPost.location}
                onChange={handleInputChange}
                placeholder="장소를 입력해 주세요"
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">추억의 순간</label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={editedPost.date}
                  onChange={handleInputChange}
                />
                <img src="/iconpng/icon-calendar.png" alt="Calendar" />
              </div>
            </div>
            <div className="form-group">
              <label>추억공개 선택</label>
              <div className="toggle-wrapper">
                <span>공개</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={editedPost.isPublic}
                    onChange={() =>
                      setEditedPost((prev) => ({ ...prev, isPublic: !prev.isPublic }))
                    }
                  />
                  <span className="slider"></span>
                </label>
                <span>비공개</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">수정 권한 인증</label>
              <input
                type="password"
                id="password"
                name="password"
                value={editedPost.password}
                onChange={handleInputChange}
                placeholder="추억 비밀번호를 입력해주세요"
              />
            </div>
          </div>
        </div>
        <button type="submit" className="submit-button">
          수정하기
        </button>
      </form>
    </div>
  );
};

export default EditPost;