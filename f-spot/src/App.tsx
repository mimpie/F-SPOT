import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KakaoMap from './components/map';
import PostForm from './components/Post';


const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>our</h1>
        <Routes>
          <Route path="/" element={<KakaoMap />} />
          <Route path="/post" element={<PostForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
