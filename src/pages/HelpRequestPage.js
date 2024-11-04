import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HelpRequestPage() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('問い合わせ');// categoryの初期値を"問い合わせ"に設定 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleHelpRequest = async () => {
    const token = localStorage.getItem('accessToken');  // JWTトークンの取得

    if (!token) {
      setError('Please login to submit a help request.');
      return;
    }

    const helpRequestData = {
      subject,
      description,
      category,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/help-requests/`, helpRequestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Help request submitted successfully!');
      setError('');
      console.log('Help Request Response:', response.data);
      
      navigate('/mypage');
    } catch (err) {
      console.error('Help Request Error:', err);
      setError('Failed to submit help request. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Help Request</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md h-24"
      />
        <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        >
        <option value="問い合わせ">問い合わせ/Info</option>
        <option value="不具合">不具合報告/bugReport</option>
        <option value="改善">改善要望/Ideation</option>
        <option value="その他">その他/Others</option>
        </select>
      <button
        onClick={handleHelpRequest}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
      >
        Submit Help Request
      </button>
    </div>
  );
}
