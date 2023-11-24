import React, { useEffect } from 'react';

const Login = () => {
  

  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  useEffect(() => {
    // 페이지가 로드될 때 실행되는 부분
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      // 추출한 코드를 세션 스토리지에 저장
      sessionStorage.setItem('kakaoAuthCode', code);
    
      // 예를 들어, 추출한 코드를 서버로 보내어 토큰을 받아오는 등의 작업 수행 가능
    }
  }, []); // 빈 배열은 페이지가 처음 로드될 때만 실행되도록 함


  
  return (
    <>
      <button onClick={handleLogin}>카카오 로그인</button>
    </>
  );
};

export default Login;
