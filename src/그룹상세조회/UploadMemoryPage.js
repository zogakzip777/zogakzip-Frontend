import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UploadMemoryPage.css";

function UploadMemory() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (e) => {
    const { value } = e.target;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setFormData({ ...formData, tags: tagsArray });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = null;

    if (selectedFile) {
      const formDataImage = new FormData();
      formDataImage.append("image", selectedFile);

      try {
        const imageUploadResponse = await fetch("/api/image", {
          method: "POST",
          body: formDataImage,
        });

        if (!imageUploadResponse.ok) {
          throw new Error("이미지 업로드 실패");
        }
        const imageUploadData = await imageUploadResponse.json();
        imageUrl = imageUploadData.imageUrl;
      } catch (error) {
        console.error("이미지 업로드 중 오류 발생:", error);
        alert("이미지 업로드 실패");
        return;
      }
    }

    const updatedFormData = {
      ...formData,
      imageUrl: imageUrl || "",
      isPublic: formData.isPublic ? 1 : 0,
    };

    try {
      const response = await fetch(`/api/groups/${groupId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error("게시물 업로드 실패");
      }

      alert("추억이 성공적으로 업로드되었습니다!");
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error("게시물 업로드 중 오류 발생:", error);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="uploadmemoryPage">
      <div className="upload-memory">
        <h3>추억 올리기</h3>
        <form onSubmit={handleSubmit}>
          <label>
            닉네임
            <input
              name="nickname"
              placeholder="닉네임을 입력하세요"
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            제목
            <input
              name="title"
              placeholder="제목을 입력하세요"
              onChange={handleInputChange}
              required
            />
          </label>
          <div className="file-input-wrapper">
            <button type="button" onClick={handleFileButtonClick}>
              이미지 선택
            </button>
            <input
              ref={fileInputRef}
              name="image"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {fileName && <span className="file-name">{fileName}</span>}
          </div>
          <label>
            본문
            <textarea
              name="content"
              placeholder="본문을 입력하세요"
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            태그 (쉼표로 구분)
            <input
              name="tags"
              placeholder="태그를 입력하세요"
              onChange={handleTagChange}
            />
          </label>
          <label>
            장소
            <input
              name="location"
              placeholder="장소를 입력하세요"
              onChange={handleInputChange}
            />
          </label>
          <label>
            순간
            <input
              name="moment"
              type="date"
              onChange={handleInputChange}
              required
            />
          </label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={() =>
                setFormData({ ...formData, isPublic: !formData.isPublic })
              }
            />
            공개
            <span className="slider"></span>
          </label>
          <label>
            게시물 비밀번호
            <input
              name="postPassword"
              type="password"
              placeholder="비밀번호를 입력하세요"
              onChange={handleInputChange}
            />
          </label>
          <label>
            그룹 비밀번호
            <input
              name="groupPassword"
              type="password"
              placeholder="비밀번호를 입력하세요"
              onChange={handleInputChange}
            />
          </label>
          <div className="button-container">
            <button type="submit">올리기</button>
            <button
              type="button"
              onClick={() => navigate(`/groups/${groupId}`)}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadMemory;
