import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import TransactionList from "./components/TransactionList";
import { useSelector, useDispatch } from "react-redux";
import { getUser, setUser } from "./slices/authSlice";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import AuthWrap from "./utils/AuthWrap";
import GuestWrap from "./utils/GuestWrap";
import CategoryList from "./components/CategoryList";

const App = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get("token");

  async function fetchUser() {
    setIsLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (res.ok) {
      const user = await res.json();
      dispatch(setUser(user));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {!isLoading && (
        <BrowserRouter>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <AuthWrap>
                  <TransactionList />
                </AuthWrap>
              }
            />
            <Route
              path="/category"
              element={
                <AuthWrap>
                  <CategoryList />
                </AuthWrap>
              }
            />
            <Route
              path="/login"
              element={
                <GuestWrap>
                  <Login />
                </GuestWrap>
              }
            />
            <Route
              path="/register"
              element={
                <GuestWrap>
                  <Register />
                </GuestWrap>
              }
            />
            <Route path="*" element={<h1>404</h1>} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
