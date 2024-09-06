import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PasswordVerification = () => {
  const { postId } = useParams();
  const navigate = useNavigate(); // navigate 함수 추가
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!password) {
      alert("비밀번호를 입력해 주세요.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_PROXY}/api/posts/${postId}/verify-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("비밀번호가 확인되었습니다. 비공개 게시물을 보여줍니다.");
        // 비밀번호가 확인되면 상세 페이지로 이동
        navigate(`/posts/${postId}`); // 상세 페이지 경로로 이동
      } else {
        alert("비밀번호가 틀렸습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("서버와의 통신 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>비공개 추억</h1>
      <p>비공개 추억에 접근하기 위해 권한 확인이 필요합니다.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력해 주세요"
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        제출하기
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordVerification;
