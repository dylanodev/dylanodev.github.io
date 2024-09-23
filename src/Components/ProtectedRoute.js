import { Outlet, Navigate } from "react-router-dom";

import useAuthStatus from "../hooks/useAuthStatus";

const ProtectedRoute = () => {
  const { isLogin, loading } = useAuthStatus();

  if (loading) return <p>Loading</p>;

  return isLogin ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
