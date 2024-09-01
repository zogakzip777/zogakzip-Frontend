import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to like post');
      fetchPostDetail(); // Refresh post data
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete post');
      navigate('/'); // Redirect to home page after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail">
      <div className="post-header">
        <div>
          <h2>{post.title}</h2>
          <p>{post.author} • {post.isPublic ? '공개' : '비공개'}</p>
        </div>
        <div>
          <button onClick={() => setIsEditing(true)}>
            <img src="/public/iconpng/icon-edit.png" alt="Edit" />
            추억 수정하기
          </button>
          <button onClick={() => setIsDeleting(true)}>
            <img src="/public/iconpng/icon-delete.png" alt="Delete" />
            추억 삭제하기
          </button>
        </div>
      </div>

      <div className="post-tags">
        {post.tags.map((tag, index) => (
          <span key={index} className="tag">#{tag}</span>
        ))}
      </div>

      <div className="post-meta">
        <span>{post.location}</span>
        <span>{post.date}</span>
        <img src="/public/iconpng/icon-gray.png" alt="Likes" />
        <span>{post.likes} 좋아요</span>
        <img src="/public/iconpng/icon-bubble.png" alt="Comments" />
        <span>{post.comments} 댓글</span>
        <button className="sympathy-button" onClick={handleLike}>
          <img src="/public/iconpng/icon-flower.png" alt="Flower" />
          공감 보내기
        </button>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <Comments postId={postId} />

      {isEditing && <EditPost postId={postId} onClose={() => setIsEditing(false)} onEdit={fetchPostDetail} />}
      {isDeleting && <DeletePost postId={postId} onClose={() => setIsDeleting(false)} onDelete={handleDelete} />}
    </div>
  );
};

export default PostDetail;