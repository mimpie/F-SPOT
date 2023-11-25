import React, { useEffect } from 'react';
import styled from 'styled-components';

const CenteredContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Adjust as needed */
`;

const LoginButton = styled.button`
  background-color: #ffeb3b; /* Kakao yellow color */
  color: #000; /* Black text color */
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Login = () => {
  const Rest_api_key = '9607a85595de4234fdbd580066c0b4b2';
  const redirect_uri = 'http://localhost:3000/Login'; // Redirect URI

  // OAuth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  useEffect(() => {
    // 페이지가 로드될 때 실행되는 부분
    const code = new URL(window.location.href).searchParams.get('code');
    let isFirstButtonClick = sessionStorage.getItem('isFirstButtonClick') !== 'true';

    if (code && isFirstButtonClick) {
      // 추출한 코드를 세션 스토리지에 저장
      sessionStorage.setItem('kakaoAuthCode', code);

      // 예를 들어, 추출한 코드를 서버로 보내어 토큰을 받아오는 등의 작업 수행 가능

      // Redirect to the desired route after successful login
      window.location.href = '/';
    } else {
      // If it's not the first button click, update the counter
      isFirstButtonClick = false;
      sessionStorage.setItem('isFirstButtonClick', 'false');
    }
  }, []); // Empty dependency array to run only once on mount

  return (
    <CenteredContainer>
      <LoginButton onClick={handleLogin}>카카오 로그인</LoginButton>
    </CenteredContainer>
  );
};

export default Login;
