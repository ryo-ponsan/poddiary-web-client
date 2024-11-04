import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigateをインポート
import { signupWithManualInput, getTokens } from '../services/auth';  // サインアップ関数を呼び出す

export default function SignupPage() {
  const [spotifyId, setSpotifyId] = useState('t-id');
  const [username, setUsername] = useState('t-user');
  const [email, setEmail] = useState('t@gmail.com');
  const [profileImage, setProfileImage] = useState('');
  const [country, setCountry] = useState('JP');
  const [subscriptionType, setSubscriptionType] = useState('Premium');
  const [errorMessage, setErrorMessage] = useState('');
  const [tokens, setTokens] = useState(null); // JWTトークンを保存するステート

  const navigate = useNavigate(); // useNavigateフックを利用


  // 手動入力データでサインアップ処理
  const handleManualSignup = async () => {
    const userData = {
      spotify_id: spotifyId,
      username: username,
      email: email,
      profile_image: profileImage,
      country: country,
      subscription_type: subscriptionType,
    };

    try {
        await signupWithManualInput(userData);
        setErrorMessage('');
        // サインアップが成功したらトークンを取得
        const savedTokens = getTokens();
        setTokens(savedTokens);
        alert('Signup successful!');
        // サインアップ成功後にマイページへリダイレクト
        navigate('/mypage');
      } catch (error) {
        console.error('Signup error', error);
        setErrorMessage('Signup failed! Please check your inputs.');
      }
    };

    return (
        <div>
          <h1>Manual Sign Up</h1>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    
          {/* Spotify用のサインアップフォーム */}
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
            placeholder="Country (e.g., JP)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subscription Type (e.g., premium)"
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
          />
          <button onClick={handleManualSignup}>Handle Sign Up</button>
    
          {/* トークンの可視化 */}
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
