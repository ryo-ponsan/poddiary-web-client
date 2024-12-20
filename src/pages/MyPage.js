import { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokens ,logout } from '../services/auth'; // トークン取得関数
import { FaPodcast, FaStar, FaCalendarAlt, FaEdit, FaTrashAlt, FaClipboard, FaTrash } from 'react-icons/fa'; // アイコンに追加

export default function MyPage() {
  const [userData, setUserData] = useState(null);  // ユーザー情報を保持
  const [diaries, setDiaries] = useState([]);  // 日記一覧を保持
  const [error, setError] = useState('');

  // ユーザー情報と日記を取得する関数
  const fetchUserDataAndDiaries = async () => {
    const { accessToken } = getTokens();  // JWTアクセストークンを取得

    if (!accessToken) {
      setError('You are not logged in.');
      return;
    }

    try {
      // ユーザー情報を取得
      const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUserData(userResponse.data);

      // 日記一覧を取得
      const diariesResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/diaries/user_diaries/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setDiaries(diariesResponse.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data.');
    }
  };

  const deleteDiary = async (diaryId) => {
    const { accessToken } = getTokens();

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/diaries/${diaryId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setDiaries((prevDiaries) => prevDiaries.filter((diary) => diary.id !== diaryId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete diary.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Diary text copied to clipboard!');
  };

  // 退会処理
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("本当に退会しますか？");
    if (!confirmDelete) return;

    const { accessToken } = getTokens();

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/users/me/delete/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      alert("退会が完了しました。ご利用ありがとうございました。");
      logout(); // ログアウト処理
      window.location.href = '/login'; // ログイン画面へリダイレクト
    } catch (err) {
      console.error(err);
      setError('Failed to delete account.');
    }
  };

  useEffect(() => {
    fetchUserDataAndDiaries();  // コンポーネントマウント時にデータを取得
  }, []);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;  // エラーがある場合は表示
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-6">My Page</h1>

      {userData && (
        <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-lg shadow-md text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Welcome, {userData.username}!</h2>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
          <button className="flex center bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" onClick={handleDeleteAccount}>
          <FaTrash className="text-black-500 mr-1" />退会
          </button>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-red-500">Your Diaries</h2>
      {diaries.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {diaries.map((diary) => (
            <li key={diary.id} className="border border-black p-4 rounded-md shadow-sm relative">
              <div className="mb-4">
                <p className="text-lg font-bold mb-2 flex items-center">
                  <FaPodcast className="mr-2" /> {diary.podcast.title}
                </p>
                {diary.episode && (
                  <p className="text-sm mb-2"><strong>Episode:</strong> {diary.episode.title}</p>
                )}
              </div>
              <div>
                <p className="text-gray-700 mb-4">{diary.diary_text}</p>
                <div className="flex justify-between items-center mb-4">
                  <p className="flex items-center text-sm text-gray-500">
                    <FaStar className="text-yellow-500 mr-1" /> {diary.rating}
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-1" /> {diary.listened_on}
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => {/* 編集機能の実装を追加予定 */}}>
                    <FaEdit /> Edit
                  </button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => deleteDiary(diary.id)}>
                    <FaTrashAlt /> Delete
                  </button>
                  <button className="text-green-500 hover:text-green-700" onClick={() => copyToClipboard(diary.diary_text)}>
                    <FaClipboard /> Copy
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No diaries found.</p>
      )}
    </div>
  );
}