import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faCalendar, faTimes, faClock, faUsers, faBell, faShare, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import defaultImg from "../../../assets/society/society-1.jpg"; // Varsayılan resim

const DetailsPopup = ({ onClose, event, onJoin }) => {
    if (!event) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Bağlantı kopyalandı!");
    };

    // Resim yoksa varsayılanı kullan
    const bgImage = event.image_url ? `http://localhost/student-automation-server/uploads/${event.image_url}` : defaultImg;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-180 relative animate-fade-in overflow-y-auto overflow-hidden max-h-140" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-black/40 z-999 cursor-pointer hover:text-black transition-colors">
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <div className="flex flex-col">
                    <div className="w-full h-64 overflow-hidden">
                        <img src={bgImage} alt="img" className="w-full h-full object-cover" />
                    </div>
                    <div className="py-4 px-6 text-2xl">
                        <h1 className="text-black font-semibold">{event.event_name}</h1>
                        <p className="text-sm text-black/50">{event.community_name}</p>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex flex-row gap-2">
                            <div className="bg-[#eff6ff] w-1/2 flex flex-row items-center justify-start gap-2 p-4 rounded-2xl">
                                <div className="bg-[#dbeafe] w-12 h-12 flex items-center justify-center rounded-lg">
                                    <FontAwesomeIcon icon={faCalendar} className="text-[#062639]" />
                                </div>
                                <div>
                                    <p className="text-black/60 text-sm">Tarih & Saat</p>
                                    <p className="text-lg font-semibold text-black">{formatDate(event.event_date)} | {formatTime(event.event_date)}</p>
                                </div>
                            </div>
                            <div className="bg-[#fff7ed] w-1/2 flex flex-row items-center justify-start gap-2 p-4 rounded-2xl">
                                <div className="bg-[#ffedd4] w-12 h-12 flex items-center justify-center rounded-lg">
                                    <FontAwesomeIcon icon={faLocation} className="text-[#ffb05f]" />
                                </div>
                                <div>
                                    <p className="text-black/60 text-sm">Konum</p>
                                    <p className="text-lg font-semibold text-black">{event.location}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* KATILIMCILAR KISMI (DÜZELTİLDİ) */}
                        <div className="bg-[#f0fdf4] w-full flex flex-row items-center justify-start gap-2 p-4 rounded-2xl mt-2">
                            <div className="bg-[#dbfce7] w-12 h-12 flex items-center justify-center rounded-lg">
                                <FontAwesomeIcon icon={faUsers} className="text-[#4dc479]" />
                            </div>
                            <div>
                                <p className="text-black/60 text-sm">Katılımcılar</p>
                                <p className="text-lg font-semibold text-black">{event.participant_count} Kişi Katılıyor</p>
                            </div>
                        </div>

                        <h1 className="text-black font-semibold py-2 px-6 mt-4">
                            <FontAwesomeIcon icon={faClock} /> Etkinlik Hakkında
                        </h1>
                        <div className="w-full h-auto">
                            <p className="bg-[#f9fafb] py-2 px-6 text-black rounded-2xl">
                                {event.description || "Bu etkinlik için açıklama girilmemiş."}
                            </p>
                        </div>
                        
                        <hr className="text-black/40 my-4"/>
                        
                        <div className="flex flex-row gap-2 w-full mb-4">
                            {event.is_joined > 0 ? (
                                <button disabled className="cursor-not-allowed flex flex-row text-white gap-4 font-semibold rounded-2xl bg-green-600 w-2/5 text-sm items-center justify-center px-4 py-2 opacity-80">
                                    <FontAwesomeIcon icon={faCheckCircle} /> Katıldınız
                                </button>
                            ) : (
                                <button 
                                    onClick={() => onJoin(event.event_id)}
                                    className="cursor-pointer flex flex-row text-white gap-4 font-semibold rounded-2xl bg-[#062639] w-2/5 text-sm items-center justify-center px-4 py-2 hover:bg-[#08415a]"
                                >
                                    <FontAwesomeIcon icon={faUsers} /> Etkinliğe Katıl
                                </button>
                            )}
                            
                            <button className="cursor-pointer flex flex-row text-black gap-4 font-semibold rounded-2xl bg-white border border-black/20 w-2/5 text-sm items-center justify-center px-4 py-2 hover:bg-gray-50">
                                <FontAwesomeIcon icon={faBell} /> Hatırlat
                            </button>
                            <button 
                                onClick={handleShare}
                                className="cursor-pointer flex flex-row text-black gap-4 font-semibold rounded-2xl bg-white border border-black/20 w-1/5 text-sm items-center justify-center px-4 py-2 hover:bg-gray-50"
                            >
                                <FontAwesomeIcon icon={faShare} /> Paylaş
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FollowedCommunities = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userId, setUserId] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR') + ' | ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    // Verileri Çek
    const fetchEvents = (uId) => {
        fetch(`http://localhost/student-automation-server/get_followed_events.php?user_id=${uId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEvents(data.data);
                }
            })
            .catch(err => console.error("Etkinlik çekme hatası:", err));
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const uId = parsedUser.user_id || (parsedUser.user && parsedUser.user.user_id) || parsedUser.id;
                setUserId(uId);
                if (uId) {
                    fetchEvents(uId);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    // Etkinliğe Katılma Fonksiyonu
    const handleJoinEvent = (eventId) => {
        if (!userId) return;

        fetch("http://localhost/student-automation-server/join_event.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, event_id: eventId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Etkinliğe başarıyla katıldınız!");
                fetchEvents(userId); // Listeyi güncelle (Sayı artsın, buton değişsin)
                setSelectedEvent(prev => ({...prev, is_joined: 1, participant_count: parseInt(prev.participant_count) + 1}));
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error("Katılma hatası:", err));
    };

    const openPopup = (event) => {
        setSelectedEvent(event);
    };

    const closePopup = () => {
        setSelectedEvent(null);
    };

    return (
        <>
            {selectedEvent && (
                <DetailsPopup 
                    event={selectedEvent} 
                    onClose={closePopup} 
                    onJoin={handleJoinEvent}
                />
            )}

            <div className="py-2 w-full flex flex-row gap-4">
                <div className="w-full border-black/10 border bg-white rounded-xl shadow-md p-6 flex flex-col min-h-50 max-h-120 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <p className="text-black/80 font-semibold mb-2">Takip Ettiğim Toplulukların Yaklaşan Etkinlikleri</p>

                    {events.length > 0 ? (
                        events.map((evt) => (
                            <div key={evt.event_id} className="bg-[#f9fafb] mt-2 shadow-sm border border-gray-100 w-full rounded-2xl flex flex-row items-center justify-between px-4 py-2 hover:bg-gray-50 transition">
                                <div className="flex flex-col px-4 py-2">
                                    <p className="text-black font-semibold">{evt.event_name}</p>
                                    <p className="text-black/50 text-sm">{evt.community_name}</p>
                                    <p className="text-black/50 mt-2 text-sm">
                                        <FontAwesomeIcon icon={faCalendar} />
                                        <span className="mx-2">{formatDate(evt.event_date)}</span>
                                        <FontAwesomeIcon icon={faLocation} className="ml-2" />
                                        <span className="ml-2">{evt.location}</span>
                                    </p>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => openPopup(evt)}
                                        className="border border-black/10 text-black font-semibold flex items-center justify-center rounded-2xl px-4 py-2 bg-white cursor-pointer hover:bg-gray-200 transition-colors"
                                    >
                                        Detay
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 h-full py-8 opacity-50">
                            <FontAwesomeIcon icon={faCalendar} size="3x" className="mb-4 text-gray-400" />
                            <p className="text-gray-500">Takip ettiğiniz toplulukların yaklaşan etkinliği bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default FollowedCommunities;