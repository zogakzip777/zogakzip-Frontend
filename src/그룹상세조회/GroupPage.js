import React, { useEffect, useState } from "react";
import "./GroupPage.css";
import logo from "./logo.png";

const GroupPage = ({ groupId }) => {
  const [groupData, setGroupData] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    imageUrl: "",
    introduction: "",
    isPublic: 0,
    password: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_PROXY}/api/groups/${groupId}`);
        if (!response.ok) {
          throw new Error("네트워크 오류");
        }
        const data = await response.json();
        setGroupData(data);
        setNewGroupData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsPasswordCorrect(false);
  };

  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletePassword("");
  };

  const handlePasswordChange = (e) => {
    setNewGroupData({ ...newGroupData, password: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = newGroupData.imageUrl;

      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);

        const uploadResponse = await fetch(`${process.env.REACT_APP_PROXY}/api/image`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("이미지 업로드 실패");
        }

        const uploadResult = await uploadResponse.json();
        imageUrl =  `${process.env.REACT_APP_PROXY}${uploadResult.imageUrl}`;
      }

      const response = await fetch(`${process.env.REACT_APP_PROXY}/api/groups/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newGroupData,
          imageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("그룹 정보 업데이트 실패");
      }

      const updatedData = await response.json();
      setGroupData(updatedData);
      handleModalClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGroupData({ ...newGroupData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const deleteResponse = await fetch(`${process.env.REACT_APP_PROXY}/api/groups/${groupId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      if (!deleteResponse.ok) {
        throw new Error(deleteResponse.body.message);
      }
      window.location.href = "/";
      alert("그룹이 삭제되었습니다.");
      setGroupData(null);
      handleDeleteModalClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendLike = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_PROXY}/api/groups/${groupId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("공감 보내기 실패");
      } else {
        alert("공감이 전송되었습니다.");
        setGroupData((prev) => ({ ...prev, likeCount: prev.likeCount + 1 }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류 발생: {error}</p>;

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
      <div className="group-container">
        <div className="group-image">
          <img
            src={groupData.imageUrl ? groupData.imageUrl : logo}
            alt="그룹 이미지"
            style={{ width: "200px", height: "200px" }} // 원하는 크기로 설정
          />
        </div>
        <div className="group-info">
          <p>
            D+
            {Math.floor(
              (new Date() - new Date(groupData.createdAt)) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            | {groupData.isPublic ? "공개" : "비공개"}
          </p>
          <h1>{groupData.name}</h1>
          <p>
            게시물 {groupData.postCount} | 그룹 공감 {groupData.likeCount}
          </p>
          <p>{groupData.introduction}</p>
          <div className="badges">
            <div className="group-content">
              <h2>획득 배지</h2>
              {groupData.badges.length > 0 ? (
                groupData.badges.map((badge, index) => (
                  <span key={index}>{badge}</span>
                ))
              ) : (
                <p style={{ marginTop: "21px" }}>획득한 배지가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
        <div className="buttons">
          <button onClick={handleModalOpen}>
            <img src="/iconpng/icon=edit.png" alt="Flower" />
            그룹 수정하기
          </button>
          <button onClick={handleDeleteModalOpen}>
            <img src="/iconpng/icon=delete.png" alt="Flower" />
            그룹 삭제하기
          </button>
          <button onClick={handleSendLike}>
            <img src="/iconpng/icon=flower.png" alt="Flower" />
            공감 보내기
          </button>
        </div>
        {isModalOpen && (
          <div className="intro-modal">
            <div className="intro-modal-content">
              <h2>그룹 정보 수정</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  그룹명:
                  <input
                    type="text"
                    value={newGroupData.name}
                    onChange={(e) =>
                      setNewGroupData({ ...newGroupData, name: e.target.value })
                    }
                  />
                </label>
                <label>
                  대표 이미지:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <label>
                  그룹 소개:
                  <textarea
                    value={newGroupData.introduction}
                    onChange={(e) =>
                      setNewGroupData({
                        ...newGroupData,
                        introduction: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  그룹 공개 선택:
                  <div className="switch">
                    <input
                      type="checkbox"
                      checked={newGroupData.isPublic}
                      onChange={(e) =>
                        setNewGroupData({
                          ...newGroupData,
                          isPublic: e.target.checked,
                        })
                      }
                    />
                    <span className="group-slider"></span>
                  </div>
                </label>
                <label>
                  수정 권한 인증:
                  <input
                    type="password"
                    value={newGroupData.password}
                    onChange={handlePasswordChange}
                    placeholder="비밀번호를 입력해 주세요"
                  />
                </label>
                <button type="submit" onClick={handleSubmit}>
                  수정하기
                </button>
                <button onClick={handleModalClose}>닫기</button>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="intro-modal">
            <div className="intro-modal-content">
              <h2>그룹 삭제</h2>
              <label>
                삭제 권한 인증:
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="비밀번호를 입력해 주세요"
                />
              </label>
              <button onClick={handleDeleteGroup}>삭제하기</button>
              <button onClick={handleDeleteModalClose}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
