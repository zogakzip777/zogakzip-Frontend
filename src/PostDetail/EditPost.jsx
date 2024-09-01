import React, { useState, useEffect } from 'react';
import './EditPost.css';

const EditPost = ({ postId, onClose, onEdit }) => {
  const [post, setPost] = useState({
    nickname: '',
    title: '',
    image: null,
    content: '',
    tags: [],
    location: '',
    date: '',
    isPublic: true,
    password: ''
  });

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: type === 'file' ? e.target.files[0] : value
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, e.target.value]
      }));
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in post) {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(post[key]));
        } else {
          formData.append(key, post[key]);
        }
      }

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update post');
      onEdit();
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="edit-post-modal">
      <div className="modal-header">
        <h2>추억 수정</h2>
        <button className="close-button" onClick={onClose}>
          <img src="/public/iconpng/icon-x.png" alt="Close" />
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
                value={post.nickname}
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
                value={post.title}
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
                  value={post.image ? post.image.name : ''}
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
                value={post.content}
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
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="location">장소</label>
              <input
                type="text"
                id="location"
                name="location"
                value={post.location}
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
                  value={post.date}
                  onChange={handleInputChange}
                />
                <img src="/public/iconpng/icon-calendar.png" alt="Calendar" />
              </div>
            </div>
            <div className="form-group">
              <label>추억공개 선택</label>
              <div className="toggle-wrapper">
                <span>공개</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={post.isPublic}
                    onChange={() => setPost(prev => ({ ...prev, isPublic: !prev.isPublic }))}
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
                value={post.password}
                onChange={handleInputChange}
                placeholder="추억 비밀번호를 입력해주세요"
              />
            </div>
          </div>
        </div>
        <button type="submit" className="submit-button">수정하기</button>
      </form>
    </div>
  );
};

export default EditPost;