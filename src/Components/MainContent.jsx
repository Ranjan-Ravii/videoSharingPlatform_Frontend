import Home from '../Pages/Home.jsx';
import LikedVideosPage from '../Pages/LikedVideosPage.jsx';
import UserProfile from '../Pages/UserProfile.jsx';
import { useSelector } from 'react-redux';
import WatchHistoryPage from '../Pages/WatchHistoryPage.jsx';
import UserSubscribedPage from '../Pages/UserSubscribedPage.jsx';

const MainContent = ({ activeSection }) => {
  const activeUser = useSelector((state) => state.auth.user);

  const renderContent = () => {
    switch (activeSection) {
      case 'Home':
        return <Home />;
      case 'Profile':
        return activeUser ? <UserProfile activeUser={activeUser} onBack={() => {}} /> : <div>Please log in to view profile</div>;
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
    <main className="flex-1  bg-green-500 text-white p-5">
      {renderContent()}
    </main>
  );
};

export default MainContent;

