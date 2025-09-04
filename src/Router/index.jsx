import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "../Pages/Login.jsx";
import SignUp from "../Pages/Signup.jsx";
import Hero from "../Pages/Hero.jsx";
import Home from "../Pages/Home.jsx"
import UserProfile from "../Pages/UserProfile.jsx";
import WatchHistoryPage from "../Pages/WatchHistoryPage.jsx"
import LikedVideosPage from "../Pages/LikedVideosPage.jsx"
import UserSubscribedPage from "../Pages/UserSubscribedPage.jsx"
import Upload from "../Pages/Upload.jsx";
import NotAvailableCard from "../Utils/NotAvailable.jsx";


function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/unauthorised" replace />;
}

export default function AppRouter() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/" element={<Hero/>}>
        <Route index element={<Home />} />
        <Route path="profile/:username" element={<UserProfile />} />
        {/* <Route path="playlist" element={<div>Playlist details...</div>} /> */}
        <Route path="history" element={<WatchHistoryPage />} />
        <Route path="liked/videos" element={<LikedVideosPage />} />
        <Route path="subscriptions" element={<UserSubscribedPage />} />
      </Route>


      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        }/>
      <Route path="/unauthorised" element={<NotAvailableCard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
