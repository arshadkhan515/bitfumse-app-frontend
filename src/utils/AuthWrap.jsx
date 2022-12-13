import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthWrap = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  return auth.isAuthenticate ? children : <Navigate to="/login" ></Navigate>
};

export default AuthWrap;
