import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigateをインポート
import { redirectToSpotifyLogin } from '../services/spotifyClient';  // spotifyClientを使用
import { loginWithSpotify, getTokens, reactivateUser } from '../services/auth';  // loginWithSpotify関数とgetTokens関数を使用

export default function LoginPage({setLoggedIn}) {
  const [spotifyId, setSpotifyId] = useState('t-id');  // 初期値として "test"
  const [username, setUsername] = useState('t-user');  // 初期値として "test_user"
  const [email, setEmail] = useState('t@gmail.com');  // 初期値として "test@gmail.com"
  const [profileImage, setProfileImage] = useState('');  // プロフィール画像は空に設定
  const [country, setCountry] = useState('JP');  // 初期値として "JP"
  const [subscriptionType, setSubscriptionType] = useState('Premium');  // 初期値として "premium"
  const [errorMessage, setErrorMessage] = useState('');
  const [tokens, setTokens] = useState(null); // トークンを保持
  const [showReactivation, setShowReactivation] = useState(false);  // 復帰確認フラグ
  const [userIdForReactivation, setUserIdForReactivation] = useState(null); // 復帰対象のユーザーID

  const navigate = useNavigate(); // useNavigateフックを利用

  const handleLogin = async () => {
    try {
      const response = await loginWithSpotify({
        spotify_id: spotifyId,
        username,
        email,
        profile_image: profileImage,
        country,
        subscription_type: subscriptionType,
      });
  
      // 退会済みのアカウントがある場合の処理
      if (response.reactivate) { 
        setShowReactivation(true);
        setUserIdForReactivation(response.user_id); 
        return;
      }
  
      setErrorMessage(''); // エラーメッセージをクリア
      const savedTokens = getTokens(); // ログイン後にトークンを取得
      setTokens(savedTokens);
  
      setLoggedIn(true);  // ログイン状態をtrueに更新
      // ログイン成功後にマイページへリダイレクト
      navigate('/mypage');
    } catch (error) {
      console.error('Login error', error);
      setErrorMessage('Login failed! Please check your credentials.');
    }
  };

  // Spotifyでログイン処理
  const handleSpotifyLogin = async () => {
    console.log("redireeeeeeeeeeeeeeect");
    redirectToSpotifyLogin();  // Spotifyの認証ページにリダイレクト
  };

  // 復帰の処理
  const handleReactivation = async () => {
    try {
      await reactivateUser(userIdForReactivation);
      setShowReactivation(false);
      // 復帰処理後にログイン画面へリダイレクト
      navigate('/login');
    } catch (error) {
      console.error('Reactivation error', error);
      setErrorMessage('Failed to reactivate account.');
    }
  };

  return (
    <div>
      <h1>Spotify Login</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* エラーメッセージの表示 */}
  
      <input
        type="text"
        placeholder="Spotify ID"
        value={spotifyId}
        onChange={(e) => setSpotifyId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Profile Image URL"
        value={profileImage}
        onChange={(e) => setProfileImage(e.target.value)}
      />
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <select
        value={subscriptionType}
        onChange={(e) => setSubscriptionType(e.target.value)}
      >
        <option value="free">Free</option>
        <option value="premium">Premium</option>
      </select>
      <button onClick={handleLogin}>Login with Spotify-handle</button>
  
      {/* Spotifyログインボタン */}
      <button onClick={handleSpotifyLogin} style={{ marginTop: '20px', backgroundColor: '#1DB954', color: 'white', padding: '10px', borderRadius: '5px' }}>
        Spotifyでログイン
      </button>
  
      {tokens && (
        <div>
          <h2>Stored Tokens</h2>
          <p><strong>Access Token:</strong> {tokens.accessToken}</p>
          <p><strong>Refresh Token:</strong> {tokens.refreshToken}</p>
        </div>
      )}
  
      {/* Reactivation modal */}
      {showReactivation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>This account has been deactivated. Do you want to reactivate it?</p>
            <div className="modal-buttons">
              <button onClick={handleReactivation} style={{ marginRight: '10px', backgroundColor: '#1DB954', color: 'white', padding: '10px', borderRadius: '5px' }}>
                Yes
              </button>
              <button onClick={() => setShowReactivation(false)} style={{ backgroundColor: '#d9534f', color: 'white', padding: '10px', borderRadius: '5px' }}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}  
