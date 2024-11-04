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
    - [**SpotifyCallbackPage.js**](#spotifycallbackpagejs)
      - [追記箇所：](#追記箇所)
      - [追記内容：](#追記内容)
    - [6. **PostDiaryPage.js**](#6-postdiarypagejs)
  - [認証機能](#認証機能)
    - [7. **HelpRequestPage.js**](#7-helprequestpagejs)
  - [日記機能](#日記機能)
  - [スタイルとUI](#スタイルとui)
  - [セットアップ](#セットアップ)
    - [環境構築](#環境構築)
      - [Spotify API用の設定](#spotify-api用の設定)
  - [TODO](#todo)

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
│   ├── auth.js     # 通常の認証処理を管理
│   ├── spotifyClient.js  # Spotify認証とAPIリクエスト用のクライアント
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
Spotify認証と通常の手動ログイン機能を提供しています。Spotifyログインボタンを押すと、SpotifyのOAuth認証ページにリダイレクトされ、同意後にアクセストークンを取得してログイン処理を行います。

- 手動ログイン：ユーザーは以下の情報を手動で入力します。
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


### **SpotifyCallbackPage.js**

#### 追記箇所：
`主要コンポーネント` セクションに **SpotifyCallbackPage.js** を追加します。

#### 追記内容：

```md
### 7. **SpotifyCallbackPage.js**
Spotify認証後にリダイレクトされるページです。このページでは、Spotifyからの認証コードを受け取り、アクセストークンを取得し、ユーザーのSpotifyアカウント情報を取得します。

- **アクセストークン取得**: 認証コードを `getSpotifyAccessToken()` 関数に渡し、アクセストークンとリフレッシュトークンを取得します。
- **アカウント情報取得**: 取得したアクセストークンを使用して、`getAccountInfo()`でユーザーのSpotifyアカウント情報を取得し、画面に表示します。

```js
useEffect(() => {
  const fetchData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      await getSpotifyAccessToken(code);
      const accountInfo = await getAccountInfo();
      setAccountInfo(accountInfo);
    }
  };
  fetchData();
}, []);
---

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
- **Spotify OAuth認証**:
  PodDiaryでは、SpotifyのOAuth 2.0を使用して、ユーザーのSpotifyアカウント情報を取得します。以下は、Spotify認証フローの概要です。

  - **redirectToSpotifyLogin()**: 
    Spotifyの認証ページにユーザーをリダイレクトします。PKCE認証のためにコードチャレンジとコードベリファイアを生成し、リダイレクトURLに追加します。

  - **getSpotifyAccessToken(code)**:
    認証後にSpotifyから返される認証コードを使用して、アクセストークンを取得します。取得したアクセストークンとリフレッシュトークンは`localStorage`に保存され、後続のAPIリクエストに使用されます。

  - **getAccountInfo()**:
    アクセストークンを使用して、Spotifyのユーザーアカウント情報を取得します。アカウント情報には、表示名、メールアドレス、国、プロフィール画像などが含まれます。

### 7. **HelpRequestPage.js**
ユーザーがアプリのサポートや問い合わせを送信するためのページです。問い合わせの件名、詳細、カテゴリを入力して送信します。バックエンドの `/api/help-requests/` エンドポイントを呼び出して、問い合わせデータを保存します。

- **主な機能**:
  - 入力された問い合わせ内容（件名、詳細、カテゴリ）をサーバーに送信。
  - 成功時には「問い合わせ送信完了」のメッセージが表示され、マイページにリダイレクトします。

- **入力フィールド**:
  - **件名（Subject）**: 問い合わせのタイトルを入力。
  - **詳細（Description）**: 問い合わせの詳細内容を入力。
  - **カテゴリ（Category）**: 問い合わせの種類（例: ログイン問題、機能リクエスト）を入力。

- **エラー表示**: 必須項目が入力されていない場合や、サーバーへの送信に失敗した場合にエラーメッセージが表示されます。

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

#### Spotify API用の設定

1. **Spotify Developerダッシュボードにアプリを登録**  
   Spotifyの[Developer Dashboard](https://developer.spotify.com/dashboard/)にアクセスし、アプリケーションを作成します。

2. **クライアントIDの取得**  
   作成したアプリケーションのクライアントIDを取得し、`spotifyClient.js`に追加します。

3. **リダイレクトURIの設定**  
   ダッシュボードでリダイレクトURIとして`http://localhost:3000/callback`を登録します。

4. **環境変数の設定**  
   環境変数や設定ファイルに、SpotifyのクライアントID、リダイレクトURIを設定します。

## TODO
- APIリクエストの[レートリミット](https://developer.spotify.com/documentation/web-api/concepts/rate-limits)考慮