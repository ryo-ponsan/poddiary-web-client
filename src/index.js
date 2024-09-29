import React from 'react';                 // Reactをインポート
import ReactDOM from 'react-dom/client';    // ReactDOMの新しいAPIをインポート
import App from './App';                    // メインのAppコンポーネントをインポート
import './index.css';

// 1. createRoot()を使って、描画するDOMの場所（#root）を指定
const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. root.render()で、Appコンポーネントをレンダリング
root.render(
  // <React.StrictMode>
    
  // </React.StrictMode>
  <App /> 
);
