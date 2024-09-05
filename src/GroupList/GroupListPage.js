import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./GroupListPage.css";

function GroupListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    introduction: "",
    isPublic: 1,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // 공개 그룹은 12개, 비공개 그룹은 20개씩 표시
  const [sortBy, setSortBy] = useState("latest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  // 비밀번호 확인 모달 관련 상태 추가
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const navigate = useNavigate();

  // 그룹 데이터를 서버에서 가져오기
  const fetchGroups = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/groups?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&keyword=${searchKeyword}&isPublic=${formData.isPublic}`
      );
      if (!response.ok) {
        throw new Error("그룹 목록 조회 실패");
      }
      const data = await response.json();

      // 페이지가 1이면 목록을 덮어쓰고, 그렇지 않으면 기존 목록에 추가
      if (page === 1) {
        setGroups(data.data);
      } else {
        setGroups((prevGroups) => [...prevGroups, ...data.data]);
      }

      setTotalPages(data.totalPages); // 전체 페이지 수 업데이트
    } catch (error) {
      console.error("그룹 목록 조회 실패:", error);
      setErrorMessage("그룹 목록 조회에 실패하였습니다.");
    }
  }, [sortBy, searchKeyword, formData.isPublic, pageSize, page]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // 더보기 버튼 클릭 시 동작
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // 정렬 옵션 변경 시
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1); // 정렬 변경 시 페이지 초기화 후 새로 가져오기
  };

  // 검색어 변경 시
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1); // 검색어 변경 시 페이지 초기화 후 새로 가져오기
  };

  // 공개 그룹 클릭 시
  const handlePublicClick = () => {
    setFormData({ ...formData, isPublic: 1 });
    setPage(1); // 페이지 초기화 후 새로 가져오기
    setPageSize(12); // 공개 그룹 페이지당 12개 설정
  };

  // 비공개 그룹 클릭 시
  const handlePrivateClick = () => {
    setFormData({ ...formData, isPublic: 0 });
    setPage(1); // 페이지 초기화 후 새로 가져오기
    setPageSize(20); // 비공개 그룹 페이지당 20개 설정
  };

  // 그룹 만들기 버튼 클릭 시
  const handleCreateGroupClick = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setFormData({
      name: "",
      password: "",
      introduction: "",
      isPublic: 1,
    });
    setSelectedFile(null);
    setIsModalOpen(false);
    setNameError(false);
  };

  // 메시지 모달 닫기
  const handleCloseMessageModal = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  // 비공개 그룹 클릭 시 비밀번호 입력 모달 열기
  const handleGroupClick = (groupId, isPublic) => {
    if (isPublic) {
      navigate(`/group/${groupId}`);
    } else {
      setSelectedGroupId(groupId);
      setPasswordModalOpen(true);
    }
  };

  // 비밀번호 확인 처리
  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch(
        `/api/groups/${selectedGroupId}/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: enteredPassword }),
        }
      );

      if (response.status === 200) {
        setPasswordModalOpen(false);
        navigate(`/group/${selectedGroupId}`);
      } else if (response.status === 401) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      } else {
        throw new Error("서버 오류가 발생했습니다.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // 파일 선택 시
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 입력 값 변경 시
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      const invalidSpecialChars = /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ!@#$%^_\s]/;
      if (invalidSpecialChars.test(value)) {
        setNameError(true);
      } else {
        setNameError(false);
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  // 그룹 제출 시
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !formData.name ||
        !formData.introduction ||
        !formData.password ||
        nameError
      ) {
        throw new Error("모든 필드를 채워주세요.");
      }

      // 이미지 업로드
      let imageUrl = null;
      if (selectedFile) {
        const formDataImage = new FormData();
        formDataImage.append("image", selectedFile);
        const imageUploadResponse = await fetch("/api/image", {
          method: "POST",
          body: formDataImage,
        });
        if (!imageUploadResponse.ok) {
          throw new Error("이미지 업로드 실패");
        }
        const imageUploadData = await imageUploadResponse.json();
        imageUrl = imageUploadData.imageUrl;
      }

      // 그룹 생성 요청
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password,
          introduction: formData.introduction,
          isPublic: formData.isPublic,
          imageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("그룹 등록에 실패하였습니다.");
      }

      const groupData = await response.json();
      setGroups((prevGroups) => [groupData, ...prevGroups]);
      setPage(1); // 그룹을 만든 후 최신순으로 다시 정렬
      setSortBy("latest"); // sortBy를 최신순으로 설정

      setFormData({
        name: "",
        password: "",
        introduction: "",
        isPublic: 1,
      });
      setSelectedFile(null);
      setIsModalOpen(false);
      setSuccessMessage("그룹이 성공적으로 등록되었습니다.");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "그룹 등록에 실패하였습니다.");
    }
  };

  // 더보기 버튼 표시 여부
  const isMoreButtonVisible = () => {
    return page < totalPages;
  };

  const formatDateDifference = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const differenceInDays = Math.floor(
      (now - createdDate) / (1000 * 60 * 60 * 24)
    );
    return `D+${differenceInDays}`;
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div className="header-container">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="조각집"
          className="title"
        />
        <button
          onClick={handleCreateGroupClick}
          className="create-group-button"
        >
          그룹 만들기
        </button>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <button
            onClick={handlePublicClick}
            className={
              formData.isPublic ? "button-selected" : "button-unselected"
            }
          >
            공개
          </button>
          <button
            onClick={handlePrivateClick}
            className={
              !formData.isPublic ? "button-selected" : "button-unselected"
            }
          >
            비공개
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            image="/iconpng/icon=search.png" /* 배경 이미지 추가 */
            type="text"
            className="search-input"
            placeholder="그룹명을 검색해 주세요"
            value={searchKeyword}
            onChange={handleSearchChange}
          />

          <select
            value={sortBy}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="latest">최신순</option>
            <option value="mostPosted">게시글 많은순</option>
            <option value="mostLiked">공감순</option>
            <option value="mostBadge">획득 배지순</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        {groups.length === 0 ? (
          <div className="empty-state">
            <img
              src={`${process.env.PUBLIC_URL}/icon.png`}
              alt="No groups available"
              className="empty-state-image"
            />
            <p className="empty-state-message">
              {formData.isPublic
                ? "등록된 공개 그룹이 없습니다."
                : "등록된 비공개 그룹이 없습니다."}
            </p>
            <p className="empty-state-message">
              가장 먼저 그룹을 만들어보세요!
            </p>
            <button className="empty-button" onClick={handleCreateGroupClick}>
              그룹 만들기
            </button>
          </div>
        ) : formData.isPublic ? (
          <div className="group-grid public-grid">
            {groups
              .filter((group) => group.isPublic)
              .map((group) => (
                <div
                  key={group.id}
                  className="group-box"
                  onClick={() => handleGroupClick(group.id, group.isPublic)} // 그룹 클릭 핸들러 수정
                >
                  {group.imageUrl ? (
                    <img src={group.imageUrl} alt={group.name} />
                  ) : null}
                  <div className="group-info">
                    <p className="group-date-status">
                      {formatDateDifference(group.createdAt)}
                      <span
                        className={
                          group.isPublic ? "status-public" : "status-private"
                        }
                      >
                        {group.isPublic ? " | 공개" : "| 비공개"}
                      </span>
                    </p>
                    <h3 className="group-name">{group.name}</h3>
                    <p className="group-introduction">{group.introduction}</p>
                    <div className="group-stats">
                      <div className="stat-item">
                        <span className="stat-label">획득 배지</span>
                        <span className="stat-value">{group.badgeCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">추억</span>
                        <span className="stat-value">{group.postCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">그룹 공감</span>
                        <span className="stat-value">
                          <img
                            src={`${process.env.PUBLIC_URL}/Grouplike.png`}
                            alt="Like icon"
                            className="like-icon"
                          />
                          {group.likeCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="group-grid private-grid">
            {groups
              .filter((group) => !group.isPublic)
              .map((group) => (
                <div
                  key={group.id}
                  className="group-box"
                  onClick={() => handleGroupClick(group.id, group.isPublic)} // 그룹 클릭 핸들러 수정
                >
                  <div className="group-info">
                    <p className="group-date-status">
                      {formatDateDifference(group.createdAt)}{" "}
                      <span className="status-private">| 비공개</span>
                    </p>
                    <h3 className="group-name">{group.name}</h3>
                    <div className="group-stats">
                      <div className="stat-item">
                        <span className="stat-label">획득 배지</span>
                        <span className="stat-value">{group.badgeCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">추억</span>
                        <span className="stat-value">{group.postCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">그룹 공감</span>
                        <span className="stat-value">{group.likeCount}K</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {isMoreButtonVisible() && (
        <button className="load-more-button" onClick={handleLoadMore}>
          더보기
        </button>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>그룹 만들기</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group group-name-wrapper">
                <label htmlFor="groupName" className="group-name-label">
                  그룹명
                </label>
                <input
                  type="text"
                  id="groupName"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="그룹명을 입력해 주세요"
                  className={`group-name-input ${nameError ? "error" : ""}`}
                />
                {nameError && (
                  <p className="error-message">
                    특수문자는 !@#$%^_만 사용하실 수 있습니다.
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="image-upload" className="label-image-upload">
                  대표 이미지
                </label>
                <div className="image-upload-container">
                  <div
                    className={`file-select-box ${
                      selectedFile ? "filled" : ""
                    }`}
                  >
                    {selectedFile ? selectedFile.name : "파일을 선택해 주세요"}
                  </div>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="file-select-button">
                    파일선택
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="introduction" style={{ textAlign: "left" }}>
                  그룹 소개
                </label>
                <textarea
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  placeholder="그룹을 소개해 주세요"
                  className="group-introduction-input"
                ></textarea>
              </div>
              <div className="form-group">
                <label style={{ textAlign: "left" }}>그룹 공개 선택</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "0px",
                  }}
                >
                  <span
                    className="group-public-text"
                    style={{ marginRight: "10px" }}
                  >
                    공개
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          isPublic: !formData.isPublic,
                        })
                      }
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password" style={{ textAlign: "left" }}>
                  비밀번호 생성
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="그룹 비밀번호를 생성해 주세요"
                  className="password-input"
                />
              </div>
              <button type="submit">만들기</button>
              <button type="button" onClick={handleCloseModal}>
                취소
              </button>
            </form>
          </div>
        </div>
      )}

      {passwordModalOpen && (
        <div className="modal password-modal">
          <div className="modal-content">
            <h2>비공개 그룹 비밀번호 입력</h2>
            <input
              type="password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              className="password-input"
              placeholder="비밀번호를 입력하세요"
            />
            <button onClick={handlePasswordSubmit}>확인</button>
            <button onClick={() => setPasswordModalOpen(false)}>취소</button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="modal">
          <div className="modal-content success-modal">
            <div className="success-message-text">그룹 만들기 성공</div>
            <div className="success-detail-message">{successMessage}</div>
            <button onClick={handleCloseMessageModal}>확인</button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="modal">
          <div className="modal-content error-modal">
            <div className="error-message-text">그룹 만들기 실패</div>
            <div className="error-detail-message">{errorMessage}</div>
            <button onClick={handleCloseMessageModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupListPage;
