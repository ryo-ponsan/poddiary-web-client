# PodDiary フロントエンド

## 概要

PodDiaryは、ユーザーがポッドキャスト番組やエピソードに対する日記（レビュー）を投稿し、管理、共有できるアプリケーションです。ここでは、フロントエンドの構成と主な機能について説明します。

## 目次

- [PodDiary フロントエンド](#poddiary-フロントエンド)
  - [概要](#概要)
  - [目次](#目次)
  - [使用技術](#使用技術)
  - [フォルダ構成](#フォルダ構成)
  - [主要コンポーネント](#主要コンポーネント)
    - [1. **App.js**](#1-appjs)
    - [2. **PrivateRoute**](#2-privateroute)
    - [3. **LoginPage.js**](#3-loginpagejs)
    - [4. **SignupPage.js**](#4-signuppagejs)
    - [5. **MyPage.js**](#5-mypagejs)
    - [6. **PostDiaryPage.js**](#6-postdiarypagejs)
  - [認証機能](#認証機能)
  - [日記機能](#日記機能)
  - [スタイルとUI](#スタイルとui)
  - [セットアップ](#セットアップ)
    - [環境構築](#環境構築)

## 使用技術

- **React**: UIライブラリ
- **Tailwind CSS**: スタイリングのためのユーティリティファーストCSSフレームワーク
- **Axios**: API通信ライブラリ
- **React Router**: ルーティングライブラリ
- **React Icons**: アイコン使用

## フォルダ構成

```bash
src/
├── components/     # 再利用可能なコンポーネント
├── pages/          # 各ページコンポーネント
├── services/       # 認証やAPI関連のサービス
├── App.js          # アプリのエントリーポイント
├── index.css       # グローバルスタイル（Tailwindをインポート）
└── index.js        # Reactのエントリーポイント
```

## 主要コンポーネント

### 1. **App.js**
アプリ全体のルーティングとログイン状態を管理します。以下のページに遷移します。

- `/login`：ログインページ
- `/signup`：サインアップページ
- `/mypage`：認証済みユーザーのマイページ
- `/post-diary`：日記投稿ページ

ログイン状態を`useState`フックで管理し、ユーザーがログインしているかどうかを`isLoggedIn()`関数で判定します。

### 2. **PrivateRoute**
認証が必要なページにアクセスする際に使用するコンポーネントです。ログインしていない場合は、ログインページにリダイレクトされます。

```js
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth';

export default function PrivateRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return children;
}
```

### 3. **LoginPage.js**
ユーザーが手動で入力する形式のSpotifyログイン機能を提供しています。入力データは以下の形式で送信されます。

```json
{
  "spotify_id": "user_spotify_id",
  "username": "test_user",
  "email": "test_user@example.com",
  "profile_image": "https://example.com/image.jpg",
  "country": "JP",
  "subscription_type": "premium"
}
```

### 4. **SignupPage.js**
サインアップページでは、メールアドレス、パスワード、ユーザー名を手動で入力し、新規ユーザーを登録します。

### 5. **MyPage.js**
認証済みユーザーのマイページ。ユーザー情報と、ユーザーが投稿した日記一覧を表示します。

- `fetchUserDataAndDiaries()`で、APIを通してユーザー情報と日記データを取得。
- 日記はカード形式で表示され、スタイルにTailwind CSSを使用。

```js
<ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {diaries.map((diary) => (
    <li key={diary.id} className="border border-black p-4 rounded-md shadow-sm">
      <div className="mb-4">
        <p className="text-lg font-bold mb-2">{diary.podcast.title}</p>
        {diary.episode && <p className="text-sm mb-2">Episode: {diary.episode.title}</p>}
      </div>
      <div>
        <p className="text-gray-700 mb-4">{diary.diary_text}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Rating: {diary.rating}</p>
          <p className="text-sm text-gray-500">Listened On: {diary.listened_on}</p>
        </div>
      </div>
    </li>
  ))}
</ul>
```

### 6. **PostDiaryPage.js**
ポッドキャストとエピソードに対する日記を投稿するページです。ユーザーが入力した内容をAPIに送信し、新しい日記を作成します。評価（`rating`）はスライダー形式で設定できます。

## 認証機能

- **JWTトークン**: ログイン後に取得したJWTトークンは、`localStorage`に保存され、APIリクエスト時に使用します。
- **認証関連API**:
  - ログイン: `/api/auth/login/`
  - サインアップ: `/api/auth/signup/`
  - Spotifyログイン（手動）: `/api/auth/spotify-login/`

## 日記機能

- **日記投稿API**: `/api/diaries/`  
  認証済みのユーザーがポッドキャストやエピソードに対する日記を投稿します。  
  リクエストボディ例：
  ```json
  {
    "podcast": {
      "api_id": "podcast_id_1",
      "title": "Sample Podcast Title"
    },
    "episode": {
      "api_id": "episode_id_1",
      "title": "Sample Episode Title"
    },
    "diary_text": "This is a sample diary text.",
    "rating": "4.00",
    "listened_on": "2024-08-10"
  }
  ```

- **日記一覧取得API**: `/api/diaries/user_diaries/`  
  ログイン中のユーザーに紐づく日記一覧を取得し、マイページで表示します。

## スタイルとUI

- **Tailwind CSS**: 全体のデザインとスタイルに使用しています。特に、以下のTailwind CSSのユーティリティクラスを活用してUIを構築。
  - グリッドレイアウト: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
  - カードスタイル: `border border-black p-4 rounded-md shadow-sm`
  - 背景グラデーション: `bg-gradient-to-r from-indigo-500 to-purple-500`

## セットアップ

### 環境構築

1. **依存パッケージのインストール**:
   ```bash
   npm install
   ```

2. **Tailwind CSSの設定**:
   Tailwind CSSを使用するために、`tailwind.config.js`と`postcss.config.js`を適切に設定します。

   **`tailwind.config.js`**:
   ```js
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}", 
     ],
     theme: {
       extend: {},
     },
     plugins: [
       require('@tailwindcss/line-clamp'),
     ],
   };
   ```

3. **ローカルサーバーの起動**:
   ```bash
   npm start
   ```

4. **ビルド**:
   ```bash
   npm run build
   ```