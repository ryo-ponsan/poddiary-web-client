import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpotifyAccessToken } from '../services/spotifyClient'; // Spotifyアクセストークン取得用
import { loginWithSpotify } from '../services/auth'; // 手動ログインAPIを使用
import { authenticatedRequest } from '../services/auth'; // 認証付きリクエスト

export default function SpotifyCallbackPage({ setLoggedIn }) {
  const navigate = useNavigate();
  const [progressMessage, setProgressMessage] = useState('初期化中...');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (!isMounted) return;
  
      setProgressMessage('認証コードを取得中...');
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code'); // Spotifyの認証コード
      console.log("認証コード取得:", code);
      console.log("アクセストークン取得開始...");
  
      if (code) {
        setProgressMessage('アクセストークンを取得中...');
  
        try {
          console.log("認証コードを使ってアクセストークンを取得開始するよ...");
          console.log(code);
          // 認証コードを使ってアクセストークンを取得
          const accessToken = await getSpotifyAccessToken(code);
          console.log("アクセストークン取得開始...");
  
          localStorage.setItem('spotify_access_token', accessToken); // トークンを保存
          setProgressMessage('アカウント情報を取得中...');
  
          // 保存したアクセストークンを使ってアカウント情報を取得
          const accountInfo = await authenticatedRequest('/api/spotify/me', 'GET');
  
          // 手動ログインのためのデータを準備
          const postData = {
            spotify_id: accountInfo.id,
            username: accountInfo.display_name,
            email: accountInfo.email,
            profile_image: accountInfo.images?.[0]?.url || '',
            country: accountInfo.country,
            subscription_type: accountInfo.product,
          };
  
          setProgressMessage('Spotifyアカウント情報でログイン中...');
          // Spotifyアカウント情報を使って手動ログイン
          const jwtResponse = await loginWithSpotify(postData);
  
          // JWTトークンをlocalStorageに保存
          localStorage.setItem('accessToken', jwtResponse.access);
          localStorage.setItem('refreshToken', jwtResponse.refresh);
  
          setLoggedIn(true);
          setProgressMessage('ログイン成功！マイページにリダイレクト中...');
          
          // 認証コードを使用した後、URLから`code`を削除
          const url = new URL(window.location.href);
          url.searchParams.delete("code");
          window.history.replaceState({}, document.title, url.href);
  
          navigate('/mypage');
        } catch (error) {
          console.error('Spotify login error', error);
          const errorDetail = error.response ? error.response.data : error.message;
          setErrorMessage('Error during Spotify login: ' + error.message);
          setProgressMessage('エラーが発生しました。');
        }
      } else {
        setProgressMessage('認証コードが見つかりませんでした。');
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false; // アンマウント時にフラグをセット
    };
  }, [navigate, setLoggedIn]);
  
  return (
    <div>
      <h1>Spotify認証処理中...</h1>
      <p>{progressMessage}</p>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}
