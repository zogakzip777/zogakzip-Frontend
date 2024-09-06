import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comments from "../Comments/Comments";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";
import "./PostDetail.css";

const PostDetail = () => {
  const { postId, groupId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [groupPosts, setGroupPosts] = useState([]);

  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_PROXY}/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      const data = await response.json();
      setPost(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_PROXY}/api/groups/${groupId}/posts`);
      if (!response.ok) {
        throw new Error("Failed to fetch group posts");
      }
      const data = await response.json();
      setGroupPosts(data);
      setTotalPosts(data.length);
      const index = data.findIndex((p) => p.id === postId);
      setCurrentIndex(index !== -1 ? index : 0);
    } catch (err) {
      console.error("Error fetching group posts:", err);
    }
  };

  useEffect(() => {
    fetchPostDetail();
    fetchGroupPosts();
  }, [postId, groupId]);

  const handleLike = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_PROXY}/api/posts/${postId}/like`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to like post");
      const updatedPost = await response.json();
      setPost((prevPost) => ({
        ...prevPost,
        likes: updatedPost.likes,
        likeCount: (prevPost.likeCount || 0) + 1,
      }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_PROXY}/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete post");
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = async (updatedPost) => {
    setPost(updatedPost);
    setIsEditing(false);
  };

  const handleNavigate = (direction) => {
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < totalPosts) {
      const newPostId = groupPosts[newIndex].id;
      navigate(`/groups/${groupId}/posts/${newPostId}`);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!post) return <div className="not-found">Post not found</div>;

  return (
    <div>
      <div className="header-container">
        <a href="/" className="title">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="조각집"
            className="title"
          />
        </a>
      </div>
      <div className="post-detail">
        <div className="post-header">
          <h2>{post.title}</h2>
          <div className="post-info">
            <span>{post.author}</span>
            <span>{post.isPublic ? "공개" : "비공개"}</span>
          </div>
          <div className="post-tags">
            {post.tags &&
              post.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
          </div>
          <div className="post-meta">
            <span>
              {post.location} | {post.moment}
            </span>
          </div>
        </div>

        <div className="post-image">
          {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
        </div>

        <div className="post-content">
          <p>{post.content}</p>
        </div>

        <div className="post-actions">
          <button onClick={() => setIsEditing(true)}>
            <img src="/iconpng/icon=edit.png" alt="Edit" />
            추억 수정하기
          </button>
          <button onClick={() => setIsDeleting(true)}>
            <img src="/iconpng/icon=delete.png" alt="Delete" />
            추억 삭제하기
          </button>
          <button className="sympathy-button" onClick={handleLike}>
            <img src="/iconpng/icon=flower.png" alt="Flower" />
            공감 보내기
          </button>
        </div>

        <div className="post-stats">
          <span>
            <img
              src="/iconpng/icon=flower.png"
              alt="Likes"
              style={{ width: "15px", height: "15px" }}
            />
            {post.likeCount || 0}
          </span>
          <span>
            <img
              src="/iconpng/icon=bubble.png"
              alt="Comments"
              style={{ width: "15px", height: "15px" }}
            />
            {post.commentCount || 0}
          </span>
        </div>

        <Comments postId={postId} />

        {isEditing && (
          <EditPost
            post={post}
            onClose={() => setIsEditing(false)}
            onEdit={handleEdit}
          />
        )}
        {isDeleting && (
          <DeletePost
            postId={postId}
            onClose={() => setIsDeleting(false)}
            onDelete={handleDelete}
          />
        )}

        <div className="group-posts-navigation">
          <button
            onClick={() => handleNavigate("prev")}
            disabled={currentIndex === 0}
            className="nav-button"
          >
            &lt;
          </button>
          <div className="current-post-index">{currentIndex + 1}</div>
          <button
            onClick={() => handleNavigate("next")}
            disabled={currentIndex === totalPosts - 1}
            className="nav-button"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
