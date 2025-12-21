import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Main from './pages/Main.jsx';
import Societies from './pages/Societies.jsx';
import Dashboard from './pages/Dashboard.jsx';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main user={user} setUser={setUser} />} />
        <Route path="/societies" element={<Societies user={user} setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
      </Routes>
    </HashRouter>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
