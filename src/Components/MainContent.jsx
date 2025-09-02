import Home from '../Pages/Home.jsx';
import LikedVideosPage from '../Pages/LikedVideosPage.jsx';
import UserProfile from '../Pages/UserProfile.jsx';
import { useSelector } from 'react-redux';
import WatchHistoryPage from '../Pages/WatchHistoryPage.jsx';
import UserSubscribedPage from '../Pages/UserSubscribedPage.jsx';

const MainContent = ({ activeSection }) => {
  const username = useSelector((state) => state.auth.user?.username);

  const renderContent = () => {
    switch (activeSection) {
      case 'Home':
        return <Home />;
      case 'Profile':
        // Pass the username as a prop to UserProfile
        return username ? <UserProfile username={username} /> : <div>Please log in to view profile</div>;
      case 'Playlist':
        return <div>Playlist details...</div>;
      case 'Watch History':
        return <WatchHistoryPage />;
      case 'Liked Video':
        return <LikedVideosPage/>;
      case 'Subscriptions':
        return <UserSubscribedPage />;
      default:
        return <div>Welcome to MyTube!</div>;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-black text-white p-5 h-full">
      {renderContent()}
    </main>
  );
};

export default MainContent;

