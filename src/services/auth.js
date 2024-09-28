import apiClient from './apiClient';
import axios from 'axios';

// 認証関連の関数を管理するファイル

export const signup = async (email, password, username) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/signup/', {
        email,
        password,
        username,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };
  
export const login = async (email, password) => {
const response = await apiClient.post('/api/auth/login/', {
    email,
    password,
});
const { access, refresh } = response.data;
localStorage.setItem('access', access);
localStorage.setItem('refresh', refresh);
return response.data;
};

// Spotifyログイン
export const spotifyLogin = async () => {
    try {
        // Spotify認証画面にリダイレクト
        const response = await axios.get('http://localhost:8000/api/auth/spotify-login-url/');
        window.location.href = response.data.url;  // Spotify認証ページにリダイレクト
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// 手動入力によるSpotifyサインアップ処理
export const signupWithManualInput = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/spotify-login/', data);
  
      // JWTトークンをlocalStorageに保存
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
  
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };

// 手動入力によるSpotifyログイン処理
export const loginWithSpotify = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/spotify-login/', data);
  
      // JWTトークンをlocalStorageに保存
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
  
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };

  // 認証済みユーザーでAPIリクエストを行うための関数
export const authenticatedRequest = async (url, method = 'GET', data = null) => {
    const accessToken = localStorage.getItem('accessToken');
  
    if (!accessToken) {
      throw new Error('No access token found. Please login.');
    }
  
    try {
      const config = {
        method,
        url: `http://localhost:8000${url}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data,
      };
  
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };
  
// トークンの可視化
export const getTokens = () => {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  };

// ログイン状態の確認
export const isLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;  // トークンが存在する場合は true
  };

// ログアウト処理
export const logout = () => {
localStorage.removeItem('access');
localStorage.removeItem('refresh');
};
  
