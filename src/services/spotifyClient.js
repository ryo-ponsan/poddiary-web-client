import axios from 'axios';

// 認証用のエンドポイントURL
const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// クライアント情報（SpotifyのAPIダッシュボードから取得）
const CLIENT_ID = '7171eb522c37422f8a040eb37e3b68e8'; // Spotifyから取得したクライアントID
// const REDIRECT_URI = 'http://localhost:3000/callback'; // 認証後のリダイレクトURL
// const REDIRECT_URI = 'http://localhost:3000/callback'; // 認証後のローカル環境リダイレクトURL
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI; // 認証後のローカル環境リダイレクトURL
const SCOPES = 'user-read-private user-read-email'; // 必要なスコープ

// PKCE認証に必要なコードチャレンジとコードベリファイアの生成関数
// code_verifier 生成ロジック
const generateCodeVerifier = () => {
    const array = new Uint32Array(128);
    window.crypto.getRandomValues(array);
    const verifier = Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    localStorage.setItem('spotify_code_verifier', verifier);  // ローカルストレージに保存
    return verifier;
  };

// code_challenge 生成ロジック
const generateCodeChallenge = async (codeVerifier) => {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

// Spotify認証ページにリダイレクト
export const redirectToSpotifyLogin = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // デバッグ: code_verifier の生成を確認
  console.log('Generated code_verifier:', codeVerifier);

  console.log('Generated code_challenge:', codeChallenge);
  localStorage.setItem('spotify_code_verifier', codeVerifier);
  
  // デバッグ: localStorage に保存された code_verifier を確認
  console.log('Saved code_verifier from localStorage:', localStorage.getItem('spotify_code_verifier'));

  const authUrl = `${SPOTIFY_AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=${SCOPES}`;
  // デバッグ: リダイレクトURLを確認
  console.log('Redirecting to:', authUrl);
  // 認証ページにリダイレクト
  window.location.href = authUrl;
};

// 認証コードからアクセストークンを取得
export const getSpotifyAccessToken = async (code) => {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  
  // デバッグ用にログを追加
  console.log('Attempting to get token with code:', code);
  console.log('Code Verifier:', codeVerifier);

  if (!codeVerifier) {
    console.error('Code verifier not found in localStorage.');
    throw new Error('Code verifier is missing.');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('client_id', CLIENT_ID);
  params.append('code_verifier', codeVerifier);

  try {
    const response = await axios.post(SPOTIFY_TOKEN_ENDPOINT, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    localStorage.removeItem('spotify_code_verifier'); // 取得後に削除
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get access token', error.message);
    throw error;
  }
};


const spotifyClient = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
});

// アクセストークンを自動的にリクエストに付加するインターセプターを設定
spotifyClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('spotify_access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // トークンをAuthorizationヘッダーに追加
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// トークンリフレッシュ処理
export const refreshSpotifyToken = async () => {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  const clientId = CLIENT_ID;

  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 200) {
      const { access_token, expires_in } = response.data;
      localStorage.setItem('spotify_access_token', access_token);
      const expiryTime = Date.now() + expires_in * 1000;
      localStorage.setItem('spotify_token_expires', expiryTime);
      return access_token;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// トークン有効期限チェックとリフレッシュ
const checkAndRefreshToken = async () => {
    const tokenExpiry = localStorage.getItem('spotify_token_expires');
    if (!tokenExpiry || Date.now() > tokenExpiry) {
      try {
        await refreshSpotifyToken();
      } catch (error) {
        console.error('Error refreshing access token:', error);
        // ここで適切なエラーハンドリングを追加
      }
    }
  };  

// アカウント情報を取得
export const getAccountInfo = async () => {
  await checkAndRefreshToken();
  try {
    const response = await spotifyClient.get('/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching account info:', error);
    throw error;
  }
};

// 番組を検索
export const searchSpotifyShows = async (keyword) => {
  await checkAndRefreshToken();
  try {
    const response = await spotifyClient.get('/search', {
      params: {
        q: keyword,
        type: 'show',
        limit: 20,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching shows:', error);
    throw error;
  }
};

// 特定の番組を取得
export const getSpotifyShow = async (showID) => {
  await checkAndRefreshToken();
  try {
    const response = await spotifyClient.get(`/shows/${showID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching show:', error);
    throw error;
  }
};

// エピソードを取得
export const getSpotifyEpisode = async (episodeID) => {
  await checkAndRefreshToken();
  try {
    const response = await spotifyClient.get(`/episodes/${episodeID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching episode:', error);
    throw error;
  }
};

// 特定の番組に紐づくエピソードリストを取得
export const getSpotifyShowEpisodes = async (showID, limit = 10, offset = 0) => {
  await checkAndRefreshToken();
  try {
    const response = await spotifyClient.get(`/shows/${showID}/episodes`, {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching show episodes:', error);
    throw error;
  }
};