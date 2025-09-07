import AppRouter from './Router'
import Navbar from './Components/Navbar.jsx'
import { setAuthenticated } from './Features/Authentication.slice.jsx';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  // Keep auth state on refresh if accessToken exists
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(setAuthenticated(true));
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen bg-black">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <div className="min-h-full">
          <AppRouter />
        </div>
      </div>
    </div>
  );
}

export default App;
