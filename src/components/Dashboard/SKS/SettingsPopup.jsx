import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser, faMailBulk, faLock, faCamera } from "@fortawesome/free-solid-svg-icons";

const SettingsPopup = ({ onClose }) => {
    const [profileData, setProfileData] = useState({
        user_id: '',
        full_name: '',
        student_number: '',
        email: ''
    });

    const [passData, setPassData] = useState({
        currentPass: '',
        newPass: '',
        confirmPass: ''
    });

    // İsimlerin baş harflerini al (Örn: Ahmet Yılmaz -> AY)
    const getInitials = (name) => {
        if (!name) return "UK";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Profil verilerini çek
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedData = JSON.parse(storedUser);
                const userId = parsedData.user_id || (parsedData.user && parsedData.user.user_id) || parsedData.id;

                if (userId) {
                    fetch(`http://localhost/student-automation-server/get_profile.php?user_id=${userId}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                setProfileData({
                                    user_id: userId,
                                    full_name: data.data.full_name || '',
                                    student_number: data.data.student_number || '',
                                    email: data.data.email || ''
                                });
                            }
                        })
                        .catch(err => console.error("Fetch hatası (Profil):", err));
                }
            } catch (error) { 
                console.error("JSON parse hatası:", error); 
            }
        }
    }, []);

    const handlePassChange = (e) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    const handleSubmitPassword = () => {
        if (passData.newPass !== passData.confirmPass) {
            alert("Yeni şifreler uyuşmuyor!");
            return;
        }
        if (passData.newPass.length < 3) {
            alert("Şifre çok kısa.");
            return;
        }

        fetch("http://localhost/student-automation-server/change_password.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: profileData.user_id,
                current_password: passData.currentPass,
                new_password: passData.newPass
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Şifre başarıyla güncellendi!");
                setPassData({ currentPass: '', newPass: '', confirmPass: '' });
            } else {
                alert("Hata: " + data.message);
            }
        })
        .catch(err => console.error("Şifre değiştirme hatası:", err));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl relative animate-fade-in mx-4">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <div className="flex flex-col h-auto max-h-[85vh] overflow-y-auto custom-scrollbar px-2">
                    <h2 className="text-xl font-semibold text-[#062639]">Profilimi Düzenle</h2>
                    <p className="text-black/60 text-sm">Profil bilgileriniz aşağıdadır. Şifrenizi buradan güncelleyebilirsiniz.</p>
                    
                    <div className="text-black w-full mt-6">
                        {/* Avatar Alanı */}
                        <div className="flex w-full flex-col items-center justify-center mb-6">
                            <div className="w-24 h-24 bg-[#062639] text-white flex items-center justify-center rounded-full font-semibold text-3xl mb-3 shadow-lg border-4 border-white">
                                {getInitials(profileData.full_name)}
                            </div>
                            {/* İleride fotoğraf yükleme eklenirse diye butonu bıraktım ama pasif yaptım */}
                            <button className="text-xs border border-gray-300 rounded-lg px-3 py-1 text-gray-600 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition">
                                <FontAwesomeIcon icon={faCamera} /> Fotoğrafı Değiştir
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="text-[#062639] font-bold border-b border-gray-100 pb-2">Kişisel Bilgiler (Salt Okunur)</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faUser} className="text-[#062639]" /> Ad Soyad
                                    </label>
                                    <input 
                                        type="text" 
                                        value={profileData.full_name}
                                        readOnly
                                        className="rounded-xl bg-gray-100 border border-gray-200 px-3 py-2 text-gray-600 cursor-not-allowed focus:outline-none" 
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faUser} className="text-[#062639]" /> Öğrenci No
                                    </label>
                                    <input 
                                        type="text" 
                                        value={profileData.student_number}
                                        readOnly 
                                        className="rounded-xl bg-gray-100 border border-gray-200 px-3 py-2 text-gray-600 cursor-not-allowed focus:outline-none" 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faMailBulk} className="text-[#062639]" /> E-Posta
                                </label>
                                <input 
                                    type="text" 
                                    value={profileData.email}
                                    readOnly
                                    className="rounded-xl bg-gray-100 border border-gray-200 px-3 py-2 text-gray-600 cursor-not-allowed focus:outline-none" 
                                />
                            </div>
                        </div>

                        <div className="mt-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <h1 className="font-bold text-[#062639] mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faLock} /> Şifre Değiştir
                            </h1>
                            <div className="space-y-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-600">Mevcut Şifre</label>
                                    <input 
                                        type="password" 
                                        name="currentPass"
                                        value={passData.currentPass}
                                        onChange={handlePassChange}
                                        placeholder="•••••" 
                                        className="rounded-xl bg-white border border-gray-300 px-3 py-2 focus:border-[#062639] focus:outline-none transition" 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-gray-600">Yeni Şifre</label>
                                        <input 
                                            type="password" 
                                            name="newPass"
                                            value={passData.newPass}
                                            onChange={handlePassChange}
                                            placeholder="•••••" 
                                            className="rounded-xl bg-white border border-gray-300 px-3 py-2 focus:border-[#062639] focus:outline-none transition" 
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-gray-600">Yeni Şifre (Tekrar)</label>
                                        <input 
                                            type="password" 
                                            name="confirmPass"
                                            value={passData.confirmPass}
                                            onChange={handlePassChange}
                                            placeholder="•••••" 
                                            className="rounded-xl bg-white border border-gray-300 px-3 py-2 focus:border-[#062639] focus:outline-none transition" 
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSubmitPassword}
                                    className="mt-2 bg-[#062639] text-white font-semibold py-2.5 px-4 w-full rounded-xl cursor-pointer hover:bg-[#08415a] transition duration-200 shadow-sm"
                                >
                                    Şifreyi Güncelle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPopup;