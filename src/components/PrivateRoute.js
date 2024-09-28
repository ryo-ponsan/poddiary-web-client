import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth';

//コンポーネントは、ユーザーがログインしていない場合にログインページへリダイレクトする役割を果たします。
export default function PrivateRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return children;
}