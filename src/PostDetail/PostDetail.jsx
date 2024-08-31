import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Comments from '../Comments/Comments';
import EditPost from './EditPost';
import DeletePost from './DeletePost';
import './PostDetail.css';

const PostDetail = () => {
  const { postId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Placeholder data - replace with actual API call
  const post = {
    author: "John Doe",
    isPublic: true,
    title: "Amazing Fishing Trip",
    tags: ["인천", "낚시"],
    location: "Incheon Pier",
    date: "24.01.19",
    likes: 15,
    comments: 5,
    content: "Had an incredible time fishing in Incheon today...",
  };

  return (
    <div className="post-detail">
      <div className="post-header">
        <div>
          <h2>{post.title}</h2>
          <p>{post.author} • {post.isPublic ? '공개' : '비공개'}</p>
        </div>
        <div>
          <button onClick={() => setIsEditing(true)}>추억 수정하기</button>
          <button onClick={() => setIsDeleting(true)}>추억 삭제하기</button>
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
        <img src="/icon-gray.png" alt="Icon" />
        <span>{post.likes} 좋아요</span>
        <img src="/icon-bubble.png" alt="Comments" />
        <span>{post.comments} 댓글</span>
        <button className="sympathy-button">
          <img src="/icon-flower.png" alt="Flower" />
          공감 보내기
        </button>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <Comments postId={postId} />

      <div className="pagination">
        {/* Add pagination component here */}
      </div>

      {isEditing && <EditPost postId={postId} onClose={() => setIsEditing(false)} />}
      {isDeleting && <DeletePost postId={postId} onClose={() => setIsDeleting(false)} />}
    </div>
  );
};

export default PostDetail;