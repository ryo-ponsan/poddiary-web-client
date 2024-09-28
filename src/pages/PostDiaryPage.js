import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigateをインポート

import axios from 'axios';

export default function PostDiaryPage() {
  const [podcastTitle, setPodcastTitle] = useState('');
  const [podcastTitleId, setPodcastTitleId] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [episodeTitleId, setEpisodeTitleId] = useState('');
  const [diaryText, setDiaryText] = useState('');
  const [rating, setRating] = useState(2.5);
  const [listenedOn, setListenedOn] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // useNavigateフックを利用

  const handlePostDiary = async () => {
    const token = localStorage.getItem('accessToken');  // JWTトークンの取得

    if (!token) {
      setError('Please login to post a diary.');
      return;
    }

    const diaryData = {
      podcast: {
        api_id: podcastTitleId,  // 固定IDだが、実際にはAPIで取得するようにできる
        title: podcastTitle,
      },
      episode: {
        api_id: episodeTitleId,  // 固定IDだが、実際にはAPIで取得するようにできる
        title: episodeTitle,
      },
      diary_text: diaryText,
      rating: rating,
      listened_on: listenedOn,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/diaries/', diaryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Diary posted successfully!');
      setError('');
      console.log('Post Response:', response.data);
      
      navigate('/mypage');
    } catch (err) {
      console.error('Post Diary Error:', err);
      setError('Failed to post diary. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Post Diary</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      <input
        type="text"
        placeholder="Podcast Title"
        value={podcastTitle}
        onChange={(e) => setPodcastTitle(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        placeholder="Podcast Title ID"
        value={podcastTitleId}
        onChange={(e) => setPodcastTitleId(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        placeholder="Episode Title"
        value={episodeTitle}
        onChange={(e) => setEpisodeTitle(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        placeholder="Episode Title ID"
        value={episodeTitleId}
        onChange={(e) => setEpisodeTitleId(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
      />
      <textarea
        placeholder="Diary Text"
        value={diaryText}
        onChange={(e) => setDiaryText(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md h-24"
      />
      {/* Rating スライダー */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Rating: {rating}</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full"
        />
      </div>
      <input
        type="date"
        placeholder="Listened On"
        value={listenedOn}
        onChange={(e) => setListenedOn(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handlePostDiary}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
      >
        Post Diary
      </button>
    </div>
  );
}