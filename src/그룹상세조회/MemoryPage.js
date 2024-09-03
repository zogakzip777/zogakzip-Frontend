import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MemoryPage.css";

function MemoryPage() {
  const { groupId } = useParams();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const loadMemories = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/posts`);
      if (!response.ok)
        throw new Error("데이터를 가져오는 데 오류가 발생했습니다.");
      const data = await response.json();
      if (Array.isArray(data)) {
        const publicPosts = data.filter((post) => post.isPublic);
        setPosts(publicPosts);
      }
    } catch (error) {
      console.error("메모리 로드 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [groupId]);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="memories-section">
      <h2>추억 목록</h2>
      <button
        className="upload-button"
        onClick={() => navigate(`/upload-memory/${groupId}`)}
      >
        {" "}
        {/* navigate로 새로운 페이지로 이동*/}
        추억 올리기
      </button>
      <div className="memories-container">
        {posts.map((post) => (
          <div
            className="memory-card"
            key={post.id}
            onClick={() => handlePostClick(post.id)}
          >
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
    </div>
  );
}

export default MemoryPage;
