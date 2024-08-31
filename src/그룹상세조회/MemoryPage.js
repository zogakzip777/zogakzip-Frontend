//memorypage

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MemoryPage.css";

function MemoryPage() {
  const { groupId } = useParams(); // URL 파라미터로 그룹 ID 가져오기
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    nickname: "",
    title: "",
    content: "",
    imageUrl: "",
    tags: [],
    location: "",
    moment: "",
    isPublic: true,
    postPassword: "",
    groupPassword: "",
  });
  const [isPasswordRequired, setPasswordRequired] = useState(false);

  // loadMemories 함수 정의
  const loadMemories = async () => {
    const response = await fetch(`/api/groups/${groupId}/posts`);
    const data = await response.json();
    const publicPosts = data.filter((post) => post.isPublic);
    setPosts(publicPosts);
  };

  useEffect(() => {
    loadMemories(); // 컴포넌트가 마운트될 때 메모리 로드
  }, [groupId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (e) => {
    const { value } = e.target;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setFormData({ ...formData, tags: tagsArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.isPublic) {
      setPasswordRequired(true);
    } else {
      await submitPost();
    }
  };

  const submitPost = async () => {
    const response = await fetch(`/api/groups/${groupId}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      await loadMemories(); // 데이터를 다시 로드
      window.history.back(); // 또는 원하는 페이지로 리다이렉트
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/groups/${groupId}/validate-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupPassword: formData.groupPassword }),
    });
    if (response.ok) {
      await submitPost();
      setPasswordRequired(false);
    } else {
      alert("비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="memories-section">
      <h2>추억 목록</h2>
      <button
        className="upload-button"
        onClick={() => setPasswordRequired(false)}
      >
        추억 올리기
      </button>
      <div className="memories-container">
        {posts.map((post) => (
          <div className="memory-card" key={post.id}>
            <img src={post.imageUrl} alt={post.title} />
            <h3>{post.title}</h3>
            <div className="tags">{post.tags.join(", ")}</div>
            <div className="meta">
              <span>
                {post.location} | {post.moment}
              </span>
              <span>
                {post.likeCount} ❤️ | {post.commentCount} 💬
              </span>
            </div>
          </div>
        ))}
      </div>
      {isPasswordRequired && (
        <div className="password-modal">
          <form onSubmit={handleSubmit}>
            <h3>추억 올리기</h3>
            <input
              name="nickname"
              placeholder="닉네임"
              onChange={handleInputChange}
            />
            <input
              name="title"
              placeholder="제목"
              onChange={handleInputChange}
            />
            <textarea
              name="content"
              placeholder="본문"
              onChange={handleInputChange}
            />
            <input
              name="imageUrl"
              placeholder="이미지 URL"
              onChange={handleInputChange}
            />
            <input
              name="location"
              placeholder="장소"
              onChange={handleInputChange}
            />
            <input
              name="moment"
              placeholder="추억의 순간"
              onChange={handleInputChange}
            />
            <input
              name="tags"
              placeholder="태그 (쉼표로 구분)"
              onChange={handleTagChange}
            />
            <label>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={() =>
                  setFormData({ ...formData, isPublic: !formData.isPublic })
                }
              />
              공개
            </label>
            <button type="submit">올리기</button>
          </form>
          {isPasswordRequired && (
            <form onSubmit={handlePasswordSubmit}>
              <h3>비공개 추억</h3>
              <input
                name="groupPassword"
                placeholder="비밀번호 입력"
                onChange={handleInputChange}
              />
              <button type="submit">제출하기</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default MemoryPage;
