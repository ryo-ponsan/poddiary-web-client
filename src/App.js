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
import { FaHome, FaPen, FaSignOutAlt, FaEnvelope } from 'react-icons/fa';

// Spotify認証後のコールバックページをインポート
import SpotifyCallbackPage from './pages/SpotifyCallbackPage'; // ここを追加
import HelpRequestPage from './pages/HelpRequestPage';

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
      <nav className="bg-blue-300 p-3">
        <ul className="flex justify-center space-x-4">
          {loggedIn ? (
            <>
              <li><Link to="/mypage" className='flex items-center px-4 py-2 text-gray-800 hover:bg-blue-200 transition duration-200'><FaHome className="mr-2" />My Page</Link></li>
              <li><Link to="/post-diary" className='flex items-center px-4 py-2 text-gray-800 hover:bg-blue-200 transition duration-200'><FaPen className="mr-2" />Post Diary</Link></li>
              <li><Link to="/help" className='flex items-center px-4 py-2 text-gray-800 hover:bg-blue-200 transition duration-200'><FaEnvelope className="mr-2" />Help</Link></li>
              <li><button onClick={handleLogout} className="flex items-center px-4 py-2 text-white hover:bg-red-300 transition duration-200"><FaSignOutAlt className="mr-2" />Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className='flex items-center px-4 py-2 text-gray-800 hover:bg-blue-200'>Login</Link></li>
              <li><Link to="/signup" className='flex items-center px-4 py-2 text-gray-800 hover:bg-blue-200'>Signup</Link></li>
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
        <Route path="/help" element={<PrivateRoute><HelpRequestPage /></PrivateRoute>} />
        {/* Spotifyの認証後のコールバックルートを追加 */}
       <Route path="/callback" element={<SpotifyCallbackPage setLoggedIn={setLoggedIn}/>} /> ここを追加
      </Routes>
    </Router>
  );
}

export default App;
