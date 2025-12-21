import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUser, faCalendar, faTimes, faMailBulk, faLock, faSearch, faLocation } from "@fortawesome/free-solid-svg-icons";
import eventImg from "../../../assets/society/society-5.png";

const Buttons = () => {
    const navigate = useNavigate();
    const [activeEventTab, setActiveEventTab] = useState('upcoming');
    const [activePopup, setActivePopup] = useState(null);

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

    const [events, setEvents] = useState({
        upcoming: [],
        past: []
    });

    const handleDiscover = () => {
        navigate("/societies");
    };

    const closePopup = () => {
        setActivePopup(null);
        setPassData({ currentPass: '', newPass: '', confirmPass: '' });
    };

    const getInitials = (name) => {
        if (!name) return "UK";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR') + ' | ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    useEffect(() => {
        if (activePopup === 'profile') {
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
        }

        if (activePopup === 'events') {
            fetch("http://localhost/student-automation-server/get_events.php")
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        const allEvents = response.data;
                        const now = new Date();
                        const upcoming = allEvents.filter(e => new Date(e.event_date) >= now);
                        const past = allEvents.filter(e => new Date(e.event_date) < now);
                        setEvents({ upcoming, past });
                    }
                })
                .catch(err => console.error("Etkinlik fetch hatası:", err));
        }
    }, [activePopup]);

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
        <>
            <div className="py-2 w-full flex flex-row gap-4 mb-4 mt-4">
                <button
                    onClick={handleDiscover}
                    className="bg-[#062639] text-white flex items-center justify-center rounded-xl px-4 py-2 cursor-pointer hover:bg-[#08415a] transition duration-200"
                >
                    <FontAwesomeIcon icon={faUsers} className="mr-2" /> Toplulukları Keşfet
                </button>

                <button
                    onClick={() => setActivePopup('profile')}
                    className="bg-white text-black border border-black/20 flex items-center justify-center rounded-xl px-4 py-2 cursor-pointer hover:bg-[#f8f2f2] transition duration-200"
                >
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Profilimi Düzenle
                </button>

                <button
                    onClick={() => setActivePopup('events')}
                    className="bg-white text-black border border-black/20 flex items-center justify-center rounded-xl px-4 py-2 cursor-pointer hover:bg-[#f8f2f2] transition duration-200"
                >
                    <FontAwesomeIcon icon={faCalendar} className="mr-2" /> Yaklaşan Etkinlikler
                </button>
            </div>

            {activePopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-240 relative animate-fade-in">
                        <button
                            onClick={closePopup}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faTimes} size="lg" className="cursor-pointer" />
                        </button>

                        {activePopup === 'profile' && (
                            <div className="flex flex-col h-auto max-h-140 overflow-auto items-start justify-start px-2 
                            [&::-webkit-scrollbar]:w-1.5
                            [&::-webkit-scrollbar-track]:bg-transparent
                          [&::-webkit-scrollbar-thumb]:bg-gray-300
                            [&::-webkit-scrollbar-thumb]:rounded-full
                          [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
                                <h2 className="text-xl font-semibold text-[#062639]">Profilimi Düzenle</h2>
                                <p className="text-black/60">Profil bilgileriniz aşağıdadır. Şifrenizi buradan güncelleyebilirsiniz.</p>
                                <div className="text-black w-full mt-4">
                                    <div className="flex w-full flex-col items-center justify-center h-40">
                                        <div className="w-20 h-20 bg-[#062639] text-white flex items-center justify-center rounded-full font-semibold text-2xl mb-4">
                                            {getInitials(profileData.full_name)}
                                        </div>
                                        <button className="border border-black/20 flex items-center justify-center rounded-xl py-1 px-2 font-semibold shadow-md cursor-pointer">Fotoğrafı Değiştir</button>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <p className="text-black font-semibold">Kişisel Bilgiler (Salt Okunur)</p>
                                        <div className="flex flex-row gap-4">
                                            <div className="w-1/2 gap-2 flex flex-col">
                                                <p className="flex flex-row items-center gap-2">
                                                    <FontAwesomeIcon icon={faUser} />
                                                    Ad Soyad
                                                </p>
                                                <input 
                                                    type="text" 
                                                    value={profileData.full_name}
                                                    readOnly
                                                    className="rounded-xl bg-[#e0e0e0] px-2 py-1 text-gray-600 cursor-not-allowed focus:outline-none" 
                                                />
                                            </div>
                                            <div className="w-1/2 gap-2 flex flex-col">
                                                <p className="flex flex-row items-center gap-2">
                                                    <FontAwesomeIcon icon={faUser} />
                                                    Öğrenci No
                                                </p>
                                                <input 
                                                    type="text" 
                                                    value={profileData.student_number}
                                                    readOnly 
                                                    className="rounded-xl bg-[#e0e0e0] px-2 py-1 text-gray-600 cursor-not-allowed focus:outline-none" 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-row w-full gap-2">
                                            <div className="w-full flex flex-col gap-2">
                                                <div className="flex flex-row items-center gap-2">
                                                    <FontAwesomeIcon icon={faMailBulk} />
                                                    <p>E-Posta</p>
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={profileData.email}
                                                    readOnly
                                                    className="rounded-xl bg-[#e0e0e0] px-2 py-1 text-gray-600 cursor-not-allowed focus:outline-none" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-4 text-black/30" />
                                    <div>
                                        <h1 className="font-semibold text-black">
                                            <FontAwesomeIcon icon={faLock} /> Şifre Değiştir
                                        </h1>
                                        <div className="flex flex-col w-full">
                                            <div className="flex flex-col w-full gap-2 my-2">
                                                <p>Mevcut Şifre</p>
                                                <input 
                                                    type="password" 
                                                    name="currentPass"
                                                    value={passData.currentPass}
                                                    onChange={handlePassChange}
                                                    placeholder="*****" 
                                                    className="rounded-xl bg-[#f3f3f5] px-2 py-1" 
                                                />
                                            </div>
                                            <div className="flex flex-col w-full gap-2 my-2">
                                                <p>Yeni Şifre</p>
                                                <input 
                                                    type="password" 
                                                    name="newPass"
                                                    value={passData.newPass}
                                                    onChange={handlePassChange}
                                                    placeholder="*****" 
                                                    className="rounded-xl bg-[#f3f3f5] px-2 py-1" 
                                                />
                                            </div>
                                            <div className="flex flex-col w-full gap-2 my-2">
                                                <p>Yeni Şifre (Tekrar)</p>
                                                <input 
                                                    type="password" 
                                                    name="confirmPass"
                                                    value={passData.confirmPass}
                                                    onChange={handlePassChange}
                                                    placeholder="*****" 
                                                    className="rounded-xl bg-[#f3f3f5] px-2 py-1" 
                                                />
                                            </div>
                                            <button 
                                                onClick={handleSubmitPassword}
                                                className="mt-4 bg-white border font-semibold border-black/20 py-2 px-4 w-full rounded-xl cursor-pointer hover:bg-gray-50"
                                            >
                                                Şifreyi Değiştir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activePopup === 'events' && (
                            <div className="text-black/60 flex flex-col h-auto max-h-140 overflow-auto items-start justify-start px-2 
                            [&::-webkit-scrollbar]:w-1.5
                            [&::-webkit-scrollbar-track]:bg-transparent
                          [&::-webkit-scrollbar-thumb]:bg-gray-300
                            [&::-webkit-scrollbar-thumb]:rounded-full
                          [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
                                <h2 className="text-xl font-semibold text-[#062639]">Tüm Etkinlikler</h2>
                                <p className="text-black/60">Aktif ve geçmiş etkinlikleri buradan takip edebilirsiniz.</p>
                                <div className="relative w-full mt-6">
                                    <input type="text" placeholder="Etkinlik Ara (Başlık, Topluluk, Konum...)" className="rounded-lg bg-[#f3f3f5] px-2 pl-10 py-2 flex items-center justify-start w-full" />
                                    <FontAwesomeIcon icon={faSearch} className="absolute top-3 left-4 text-black/60" />
                                </div>
                                <div className="w-full">
                                    <h2 className="text-xl font-bold my-4 text-[#062639]">Etkinlikler</h2>

                                    <div className="flex flex-row bg-[#f3f3f5] rounded-2xl w-full mt-4 h-12 items-center gap-2 p-2">
                                        <div
                                            onClick={() => setActiveEventTab('upcoming')}
                                            className={`text-sm w-1/2 rounded-xl cursor-pointer flex items-center justify-center h-full font-semibold transition-all duration-300
                                            ${activeEventTab === 'upcoming'
                                                ? 'bg-white text-black shadow-sm'
                                                : 'bg-transparent text-gray-500 hover:text-black'}`}
                                        >
                                            Yaklaşan Etkinlikler ({events.upcoming.length})
                                        </div>

                                        <div
                                            onClick={() => setActiveEventTab('past')}
                                            className={`text-sm w-1/2 rounded-xl cursor-pointer flex items-center justify-center h-full font-semibold transition-all duration-300
                                            ${activeEventTab === 'past'
                                                ? 'bg-white text-black shadow-sm'
                                                : 'bg-transparent text-gray-500 hover:text-black'}`}
                                        >
                                            Geçmiş Etkinlikler ({events.past.length})
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        {activeEventTab === 'upcoming' ? (
                                            <div className="animate-fade-in h-full">
                                                {events.upcoming.length > 0 ? (
                                                    events.upcoming.map((evt) => (
                                                        <div key={evt.event_id} className="h-full border border-gray-200 p-3 rounded-xl mb-2 flex flex-row gap-4 items-center bg-white">
                                                            <div className="w-1/5 h-full flex items-center">
                                                                <img src={eventImg} alt="img" className="w-40 h-auto" />
                                                            </div>
                                                            <div className="w-2/5">
                                                                <p className="text-black font-semibold text-md">{evt.event_name}</p>
                                                                <p className="text-sm">{evt.community_name || 'Bilinmeyen Topluluk'}</p>
                                                                <p className="text-sm">
                                                                    <FontAwesomeIcon icon={faCalendar} /> {formatDate(evt.event_date)}
                                                                </p>
                                                                <p className="text-sm">
                                                                    <FontAwesomeIcon icon={faLocation} /> {evt.location}
                                                                </p>
                                                                {/* Katılımcı sayısı event tablosunda olmadığı için placeholder */}
                                                                <p className="text-sm">
                                                                    <FontAwesomeIcon icon={faUsers} /> 150 Katılımcı
                                                                </p>
                                                            </div>
                                                            <div className="w-2/5 flex h-24 items-end justify-end px-4">
                                                                <button className="bg-[#062639] rounded-lg px-2 py-1 text-white cursor-pointer hover:bg-[#08415a]">Katıl</button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-gray-500 py-4">Yaklaşan etkinlik bulunmuyor.</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="animate-fade-in">
                                                {events.past.length > 0 ? (
                                                    events.past.map((evt) => (
                                                        <div key={evt.event_id} className="h-full border border-gray-200 p-3 rounded-xl mb-2 flex flex-row gap-4 items-center bg-white opacity-80">
                                                            <div className="w-1/5 h-full flex items-center">
                                                                <img src={eventImg} alt="img" className="w-40 h-auto grayscale" />
                                                            </div>
                                                            <div className="w-2/5">
                                                                <p className="text-black font-semibold text-md">{evt.event_name}</p>
                                                                <p className="text-sm">{evt.community_name}</p>
                                                                <p className="text-sm">
                                                                    <FontAwesomeIcon icon={faCalendar} /> {formatDate(evt.event_date)}
                                                                </p>
                                                                <p className="text-sm">
                                                                    <FontAwesomeIcon icon={faLocation} /> {evt.location}
                                                                </p>
                                                            </div>
                                                            <div className="w-2/5 flex h-24 items-end justify-end px-4">
                                                                <button className="bg-[#062639] rounded-lg px-2 py-1 text-white cursor-not-allowed opacity-50">Tamamlandı</button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-gray-500 py-4">Geçmiş etkinlik bulunmuyor.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Buttons;