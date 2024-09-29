// App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { isLoggedIn, logout } from './services/auth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import PostDiaryPage from './pages/PostDiaryPage';
import PrivateRoute from './components/PrivateRoute';  // PrivateRouteをインポート
import { useState, useEffect } from 'react';
import './index.css';

// Spotify認証後のコールバックページをインポート
import SpotifyCallbackPage from './pages/SpotifyCallbackPage'; // ここを追加

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    alert("You have been logged out.");
  };

  return (
    <Router>
      <nav>
        <ul>
          {loggedIn ? (
            <>
              <li><Link to="/mypage">My Page</Link></li>
              <li><Link to="/post-diary">Post Diary</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* PrivateRouteでログイン必須ページを保護 */}
        <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
        <Route path="/post-diary" element={<PrivateRoute><PostDiaryPage /></PrivateRoute>} />
        {/* Spotifyの認証後のコールバックルートを追加 */}
       <Route path="/callback" element={<SpotifyCallbackPage setLoggedIn={setLoggedIn}/>} /> {/* ここを追加 */}
      </Routes>
    </Router>
  );
}

export default App;
