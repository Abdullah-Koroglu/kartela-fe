import { Navigate, Outlet } from "react-router-dom";

const useAuth = (jwt) => {
  return jwt && true;
};

const ProtectedRoutes = () => {
  const jwt = localStorage.getItem("jwt");

  const isAuth = useAuth (jwt);
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;