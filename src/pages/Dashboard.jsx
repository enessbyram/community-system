import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginPopup from "../components/LoginPopup";

import StudentDashboard from "../components/Dashboard/Student/StudentDashboard";
import ManagementDashboard from "../components/Dashboard/Management/ManagementDashboard";
import ConsultantDashboard from "../components/Dashboard/Consultant/ConsultantDashboard";
import SksDashboard from "../components/Dashboard/SKS/SksDashboard";

export default function Dashboard({ user, setUser }) {
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate("/");
    };

    // Hangi dashboard'un gösterileceğine karar veren fonksiyon
    const renderContent = () => {
        if (!user) {
            return <div className="text-center py-20">Lütfen giriş yapınız...</div>;
        }

        // Veritabanındaki 'role' sütununa göre eşleştirme
        // Login.php'de atanan roller: 'student', 'admin' (management), 'advisor', 'sks'
        switch (user.role) {
            case 'student':
                return <StudentDashboard />;
            case 'admin': // Management (Yönetim Kurulu) genelde admin rolüyle eşleşiyor veritabanında
                return <ManagementDashboard />;
            case 'advisor': // Consultant
                return <ConsultantDashboard />;
            case 'sks': // Admin/SKS
                return <SksDashboard />;
            default:
                // Rol tanımsızsa veya farklıysa varsayılan olarak öğrenci veya hata göster
                return <StudentDashboard />;
        }
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

            <div className="h-auto w-full flex items-center justify-center bg-[#f9fafb]">
                {/* Dinamik İçerik Burada Çağırılıyor */}
                {renderContent()}
            </div>

            <Footer />
        </>
    );
}