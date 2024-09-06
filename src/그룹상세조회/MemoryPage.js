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
      <div className="header">
        <h2>추억 목록</h2>
        <button
          className="upload-button"
          onClick={() => navigate(`/upload-memory/${groupId}`)}
        >
          추억 올리기
        </button>
      </div>
      <div className="search-container">
        <div className="left-controls">
          <button
            className={isPublic ? "active" : ""}
            onClick={() => setIsPublic(true)}
          >
            공개
          </button>
          <button
            className={!isPublic ? "active" : ""}
            onClick={() => setIsPublic(false)}
          >
            비공개
          </button>
        </div>
        <div className="search-input">
          <input
            type="text"
            placeholder="태그 혹은 제목을 입력해 주세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="right-controls">
          <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
            <option value="latest">추천순</option>
            <option value="mostCommented">댓글 많은 순</option>
            <option value="mostLiked">좋아요 많은 순</option>
          </select>
        </div>
      </div>
      <div className="memories-container">
        {posts.length === 0 ? (
          <div className = "empty-memory">
            <img
              src= {`${process.env.PUBLIC_URL}/icon.png`} 
              alt="Empty state" 
              className="empty-memory-image" // CSS 클래스 추가로 이미지 스타일링 가능
            />
            <p className="emptyMemory1">게시된 추억이 없습니다.</p>
            <p className="emptyMemory2">첫 번째 추억을 올려보세요!</p>
          </div>  
        ) : (
          posts.map((post) => (
            <div
              className="memory-card"
              key={post.id}
              onClick={() => handlePostClick(post.id)}
            >
              <img src={post.imageUrl || logo} alt={post.title} />
              <div className="memory-info">
                <h3>{post.title}</h3>
                <div className="tags">#{post.tags.join(", ")}</div>
                <div className="meta">
                  <span>
                    {post.location} | {post.moment}
                  </span>
                  <span>
                    <img
                      src="/iconpng/icon=flower.png"
                      alt="Flower"
                      style={{ width: "15px", height: "15px" }}
                    />
                    {post.likeCount} 💬 {post.commentCount}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 새로운 pagination 컨테이너 추가 */}
      <div className="pagination-container">
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
    </div>
  );
}

export default MemoryPage;
