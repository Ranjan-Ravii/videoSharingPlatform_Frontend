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
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
