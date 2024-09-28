import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigateをインポート
import { loginWithSpotify, getTokens } from '../services/auth';  // loginWithSpotify関数とgetTokens関数を使用

export default function LoginPage({setLoggedIn}) {
  const [spotifyId, setSpotifyId] = useState('ryo-test-id');  // 初期値として "test"
  const [username, setUsername] = useState('ryo-test');  // 初期値として "test_user"
  const [email, setEmail] = useState('ryo-test@gmail.com');  // 初期値として "test@gmail.com"
  const [profileImage, setProfileImage] = useState('');  // プロフィール画像は空に設定
  const [country, setCountry] = useState('JP');  // 初期値として "JP"
  const [subscriptionType, setSubscriptionType] = useState('premium');  // 初期値として "premium"
  const [errorMessage, setErrorMessage] = useState('');
  const [tokens, setTokens] = useState(null); // トークンを保持

  const navigate = useNavigate(); // useNavigateフックを利用

  const handleLogin = async () => {
    try {
      await loginWithSpotify({
        spotify_id: spotifyId,
        username,
        email,
        profile_image: profileImage,
        country,
        subscription_type: subscriptionType,
      });
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
      <button onClick={handleLogin}>Login with Spotify</button>

      {tokens && (
        <div>
          <h2>Stored Tokens</h2>
          <p><strong>Access Token:</strong> {tokens.accessToken}</p>
          <p><strong>Refresh Token:</strong> {tokens.refreshToken}</p>
        </div>
      )}
    </div>
  );
}
