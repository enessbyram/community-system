import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import { SocietyList } from '../components/SocietyLists/SocietyList.jsx'
import { useState } from "react";
import LoginPopup from "../components/LoginPopup.jsx";
import { useNavigate } from "react-router-dom";

function Societies({ user, setUser }) {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); 
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
      <SocietyList />
      <Footer />
    </>
  )
}

export default Societies;