import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestWrap = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  return !auth.isAuthenticate ? children : <Navigate to="/" replace={true}></Navigate>
};

export default GuestWrap;
