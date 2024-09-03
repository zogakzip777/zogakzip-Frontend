import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MemoryPage.css";

function UploadMemory() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: "",
    title: "",
    content: "",
    image: null,
    tags: [],
    location: "",
    moment: "",
    isPublic: 1,
    postPassword: "",
    groupPassword: "",
  });

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
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { image, ...data } = formData;
    const form = new FormData();
    for (const key in data) {
      form.append(key, data[key]);
    }
    if (image) {
      form.append("image", image);
    }

    const response = await fetch(`/api/groups/${groupId}/posts`, {
      method: "POST",
      body: form,
    });

    if (response.ok) {
      alert("추억이 성공적으로 업로드되었습니다!");
      navigate(`/groups/${groupId}`); // 업로드 후 그룹 페이지로 이동
    } else {
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="upload-memory">
      <h3>추억 올리기</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="nickname"
          placeholder="닉네임"
          onChange={handleInputChange}
          required
        />
        <input
          name="title"
          placeholder="제목"
          onChange={handleInputChange}
          required
        />
        <input name="image" type="file" onChange={handleFileChange} />
        <textarea
          name="content"
          placeholder="본문"
          onChange={handleInputChange}
          required
        />
        <input
          name="tags"
          placeholder="태그 (쉼표로 구분)"
          onChange={handleTagChange}
        />
        <input
          name="location"
          placeholder="장소"
          onChange={handleInputChange}
        />
        <input
          name="moment"
          type="date"
          onChange={handleInputChange}
          required
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
        <input
          name="groupPassword"
          placeholder="비밀번호 입력 (선택)"
          onChange={handleInputChange}
        />
        <button type="submit">올리기</button>
      </form>
      <button onClick={() => navigate(`/groups/${groupId}`)}>취소</button>
    </div>
  );
}

export default UploadMemory;
