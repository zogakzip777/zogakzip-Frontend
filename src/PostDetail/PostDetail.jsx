import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Comments from '../Comments/Comments';
import EditPost from './EditPost';
import DeletePost from './DeletePost';
import './PostDetail.css';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to like post');
      const updatedPost = await response.json();
      setPost(updatedPost);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete post');
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = async (updatedPost) => {
    setPost(updatedPost);
    setIsEditing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-detail">
      <div className="post-header">
        <h2>{post.title}</h2>
        <div className="post-info">
          <span>{post.author}</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span>{post.location}</span>
        </div>
        <div className="post-actions">
          <button onClick={() => setIsEditing(true)}>
            <img src="/iconpng/icon-edit.png" alt="Edit" />
            추억 수정하기
          </button>
          <button onClick={() => setIsDeleting(true)}>
            <img src="/iconpng/icon-delete.png" alt="Delete" />
            추억 삭제하기
          </button>
        </div>
      </div>

      <div className="post-image">
        {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-tags">
        {post.tags && post.tags.map((tag, index) => (
          <span key={index} className="tag">#{tag}</span>
        ))}
      </div>

      <div className="post-meta">
        <button className="sympathy-button" onClick={handleLike}>
          <img src="/iconpng/icon-flower.png" alt="Flower" />
          공감 보내기
        </button>
        <span>{post.likes} 좋아요</span>
        <span>{post.comments ? post.comments.length : 0} 댓글</span>
      </div>

      <Comments postId={postId} />

      {isEditing && <EditPost post={post} onClose={() => setIsEditing(false)} onEdit={handleEdit} />}
      {isDeleting && <DeletePost postId={postId} onClose={() => setIsDeleting(false)} onDelete={handleDelete} />}
    </div>
  );
};

export default PostDetail;