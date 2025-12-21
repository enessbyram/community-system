import { useState } from "react";
import LoginPopup from "../components/LoginPopup";
import Header from "../components/Header";
import Slider from "../components/MainPage/Slider";
import Announcements from "../components/MainPage/Announcements";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Main({ user, setUser }) {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // DÜZELTME: 'user'
    navigate("/");
  };

  return (
    <>
      <Header
        onLoginClick={() => setShowPopup(true)}
        user={user}
        onLogout={handleLogout}
      />

      {showPopup && (
        <LoginPopup
          onClose={() => setShowPopup(false)}
          setUser={setUser}
        />
      )}

      <Slider />
      <Announcements />
      <Footer />
    </>
  );
}

export default Main;