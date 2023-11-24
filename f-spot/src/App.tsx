import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KakaoMap from './components/map';
import PostForm from './components/Post';
import Login from './components/kakaoLogin';


const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>our</h1>
        <Routes>
          <Route path="/" element={<KakaoMap />} />
          <Route path="/post" element={<PostForm />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
