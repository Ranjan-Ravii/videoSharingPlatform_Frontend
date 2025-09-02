import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login.jsx";
import SignUp from "../Pages/Signup.jsx";
import NotAvailableCard from "../Utils/NotAvailable.jsx";
import Hero from "../Pages/Hero.jsx";
import UserProfile from "../Pages/UserProfile.jsx";
import { useSelector } from "react-redux";
import Upload from "../Pages/Upload.jsx";


function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/unauthorised" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:username"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route path="/unauthorised" element={<NotAvailableCard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
