import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import KakaoMap from './components/map';
import PostForm from './components/Post';
import Login from './components/kakaoLogin';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Navigation = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 20px;
  }

  li {
    font-size: 18px;
  }

  a {
    text-decoration: none;
    color: white;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Redirect to the login page
    window.location.href = "/login";
  };

  return (
    <Router>
      <HeaderContainer>
        <Navigation>
          <ul>
            <li><Link to="/">지도</Link></li>
            <li><Link to="/post">글쓰기</Link></li>
          </ul>
        </Navigation>
        <LoginButton onClick={handleLogin}>로그인</LoginButton>
      </HeaderContainer>

      <Routes>
        <Route path="/" element={<KakaoMap />} />
        <Route path="/post" element={<PostForm />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
    </Router>
  );
};

export default App;