import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";

import NavBar from "./components/NavBar";
import Home from "./pages/HomePage";
import Settings from "./pages/SettingsPage/index.jsx";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import ForgotPassword from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import Profile from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";

import "./index.css";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  useEffect(() => {
    checkAuth(true);
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      subscribeToMessages();
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [authUser, subscribeToMessages, unsubscribeFromMessages]);

  if (isCheckingAuth)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path="/forgotPassword" element={!authUser ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/resetPassword/:token" element={!authUser ? <ResetPasswordPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/search" element={authUser ? <SearchPage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster
        toastOptions={{
          duration: 3000,
          style: {
            background: "#605dff",
            color: "#fff",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "14px",
          },
        }}
        limit={1}
      />
    </div>
  );
}

export default App;
