import React, { useState } from 'react';
import './Comments.css';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([
    { id: 1, author: '사용자1', time: '1시간 전', content: '멋진 추억이네요!' },
    { id: 2, author: '사용자2', time: '30분 전', content: '저도 가보고 싶어요.' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentComment, setCurrentComment] = useState({ author: '', content: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentComment({ ...currentComment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      const newComment = {
        id: comments.length + 1,
        author: currentComment.author,
        time: '방금 전',
        content: currentComment.content,
        password: currentComment.password
      };
      setComments([...comments, newComment]);
    } else if (modalMode === 'edit') {
      const updatedComments = comments.map(comment =>
        comment.id === currentComment.id ? { ...comment, ...currentComment } : comment
      );
      setComments(updatedComments);
    }
    setIsModalOpen(false);
    setCurrentComment({ author: '', content: '', password: '' });
  };

  const handleEdit = (comment) => {
    setCurrentComment(comment);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const password = prompt('댓글 비밀번호를 입력해주세요');
    const comment = comments.find(c => c.id === id);
    if (comment && comment.password === password) {
      setComments(comments.filter(c => c.id !== id));
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="comments-section">
      <h3>댓글</h3>
      <button onClick={() => { setModalMode('create'); setIsModalOpen(true); }}>댓글 작성</button>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <span>{comment.author}</span>
              <span>{comment.time}</span>
            </div>
            <p>{comment.content}</p>
            <div className="comment-actions">
              <button onClick={() => handleEdit(comment)}>수정</button>
              <button onClick={() => handleDelete(comment.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="comment-modal">
          <div className="modal-header">
            <h2>{modalMode === 'create' ? '댓글 등록' : '댓글 수정'}</h2>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
              <img src="/public/iconpng/icon-x.png" alt="Close" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="comment-form">
            <div className="form-group">
              <label htmlFor="author">닉네임</label>
              <input
                type="text"
                id="author"
                name="author"
                value={currentComment.author}
                onChange={handleInputChange}
                placeholder="닉네임을 입력해주세요"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">댓글</label>
              <textarea
                id="content"
                name="content"
                value={currentComment.content}
                onChange={handleInputChange}
                placeholder="댓글을 입력해주세요"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{modalMode === 'create' ? '비밀번호 생성' : '수정 권한 인증'}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={currentComment.password}
                onChange={handleInputChange}
                placeholder={modalMode === 'create' ? '댓글 비밀번호를 생성해주세요' : '댓글 비밀번호를 입력해 주세요'}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              {modalMode === 'create' ? '등록하기' : '수정하기'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Comments;