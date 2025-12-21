import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faCalendar, faTimes, faClock, faUsers, faBell, faShare, faCheckCircle, faEye } from "@fortawesome/free-solid-svg-icons";
import defaultImg from "../../../assets/society/society-1.jpg"; 

// DETAY POPUP (Aynı yapıyı koruyoruz)
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
                            <button 
                                onClick={() => onJoin(event.event_id)}
                                className="cursor-pointer flex flex-row text-white gap-4 font-semibold rounded-2xl bg-[#062639] w-2/5 text-sm items-center justify-center px-4 py-2 hover:bg-[#08415a]"
                            >
                                <FontAwesomeIcon icon={faUsers} /> Etkinliğe Katıl
                            </button>
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

// ANA BİLEŞEN
const LatestEvents = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userId, setUserId] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    useEffect(() => {
        // Kullanıcı bilgisini al (Katıl butonu için)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserId(parsedUser.user_id || parsedUser.id);
            } catch (e) { console.error(e); }
        }

        // Tüm son etkinlikleri çek (Login zorunluluğu yok)
        fetch("http://localhost/student-automation-server/get_latest_events.php")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEvents(data.data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleJoinEvent = (eventId) => {
        if (!userId) {
            alert("Etkinliğe katılmak için giriş yapmalısınız.");
            return;
        }

        fetch("http://localhost/student-automation-server/join_event.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, event_id: eventId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Etkinliğe başarıyla katıldınız!");
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error("Katılma hatası:", err));
    };

    return (
        <>
            {selectedEvent && (
                <DetailsPopup 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)} 
                    onJoin={handleJoinEvent}
                />
            )}

            <div className="w-full mt-8 border border-black/20 rounded-xl px-4 py-2 bg-white shadow-md">
                <h2 className="text-md font-semibold text-[#062639] mb-4">Son Düzenlenen Etkinlikler</h2>
                
                <div className="grid grid-cols-1 gap-4">
                    {events.length > 0 ? (
                        events.map((evt) => (
                            <div key={evt.event_id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition">
                                <div>
                                    <h3 className="font-semibold text-lg text-black">{evt.event_name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {evt.participant_count} katılımcı - {formatDate(evt.event_date)}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelectedEvent(evt)}
                                    className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                                >
                                    <FontAwesomeIcon icon={faEye} /> Detay
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">Geçmiş etkinlik bulunmuyor.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default LatestEvents;