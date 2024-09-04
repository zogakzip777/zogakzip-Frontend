import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MemoryPage.css";
import logo from "./logo.png";

function MemoryPage() {
  const { groupId } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("latest");
  const [keyword, setKeyword] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const navigate = useNavigate();

  const loadMemories = async () => {
    try {
      const response = await fetch(
        `/api/groups/${groupId}/posts?page=${currentPage}&pageSize=10&sortBy=${sortBy}&keyword=${encodeURIComponent(
          keyword
        )}&isPublic=${isPublic ? 1 : 0}`
      );
      if (!response.ok) {
        throw new Error("데이터를 가져오는 데 오류가 발생했습니다.");
      }

      const responseData = await response.json();
      const { currentPage: apiCurrentPage, totalPages, data } = responseData;

      if (Array.isArray(data)) {
        setPosts(data);
        setCurrentPage(apiCurrentPage);
        setTotalPages(totalPages);
      } else {
        console.error("데이터 형식이 잘못되었습니다.", responseData);
      }
    } catch (error) {
      console.error("메모리 로드 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [groupId, currentPage, sortBy, keyword, isPublic]);

  const handlePostClick = (postId) => {
    if (!isPublic) {
      navigate(`/password-verification/${postId}`);
    } else {
      navigate(`/post/${postId}`);
    }
  };

  return (
    <div className="memories-section">
      <h2>추억 목록</h2>
      <button
        className="upload-button"
        onClick={() => navigate(`/upload-memory/${groupId}`)}
      >
        추억 올리기
      </button>
      <div className="search-container">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="latest">최신순</option>
          <option value="mostCommented">댓글 많은 순</option>
          <option value="mostLiked">좋아요 많은 순</option>
        </select>
        <div className="toggle-buttons">
          <button
            onClick={() => setIsPublic(true)}
            className={isPublic ? "active" : ""}
          >
            공개
          </button>
          <button
            onClick={() => setIsPublic(false)} // 비공개 버튼 클릭 시 상태 변경
            className={!isPublic ? "active" : ""}
          >
            비공개
          </button>
        </div>
      </div>
      <div className="memories-container">
        {posts.length === 0 ? (
          <p>게시물이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <div
              className="memory-card"
              key={post.id}
              onClick={() => handlePostClick(post.id)}
            >
              <img src={post.imageUrl || logo} alt={post.title} />
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
          ))
        )}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MemoryPage;
