import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCalendar, faCog, faFileLines } from "@fortawesome/free-solid-svg-icons";
import SettingsPopup from "./SettingsPopup"; // Yeni oluşturduğumuz popup'ı çağırıyoruz

const Buttons = () => {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Popup kontrolü

    // 1. Tüm Toplulukları Görüntüle
    const handleViewCommunities = () => {
        navigate("/societies");
    };

    // 2. Etkinlik Takvimi (Pasif)
    const handleCalendar = () => {
        console.log("Takvim Tıklandı (Pasif)");
    };

    // 3. Sistem Ayarları -> Popup Aç
    const handleSettings = () => {
        setIsSettingsOpen(true);
    };

    // 4. Raporlar (Pasif)
    const handleReports = () => {
        console.log("Raporlar Tıklandı (Pasif)");
    };

    return (
        <>
            {/* AYARLAR POPUP'I (State true ise görünür) */}
            {isSettingsOpen && (
                <SettingsPopup onClose={() => setIsSettingsOpen(false)} />
            )}

            <div className="w-full bg-white border border-black/10 rounded-xl shadow-sm p-6 my-6">
                <h2 className="text-gray-900 font-semibold text-lg mb-4">Sistem Yönetimi</h2>
                
                <div className="flex flex-row flex-wrap gap-4">
                    {/* 1. Tüm Toplulukları Görüntüle (Koyu Buton) */}
                    <button
                        onClick={handleViewCommunities}
                        className="bg-[#062639] text-white flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer hover:bg-[#08415a] transition duration-200 shadow-sm"
                    >
                        <FontAwesomeIcon icon={faUsers} /> 
                        Tüm Toplulukları Görüntüle
                    </button>

                    {/* 2. Etkinlik Takvimi (Pasif) */}
                    <button
                        onClick={handleCalendar}
                        className="bg-white text-gray-700 border border-gray-200 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold cursor-not-allowed opacity-70 transition duration-200 shadow-sm"
                    >
                        <FontAwesomeIcon icon={faCalendar} /> 
                        Etkinlik Takvimi
                    </button>

                    {/* 3. Sistem Ayarları (Popup Açar) */}
                    <button
                        onClick={handleSettings}
                        className="bg-white text-gray-700 border border-gray-200 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition duration-200 shadow-sm"
                    >
                        <FontAwesomeIcon icon={faCog} /> 
                        Sistem Ayarları
                    </button>

                    {/* 4. Raporlar (Pasif) */}
                    <button
                        onClick={handleReports}
                        className="bg-white text-gray-700 border border-gray-200 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold cursor-not-allowed opacity-70 transition duration-200 shadow-sm"
                    >
                        <FontAwesomeIcon icon={faFileLines} /> 
                        Raporlar
                    </button>
                </div>
            </div>
        </>
    );
}

export default Buttons;