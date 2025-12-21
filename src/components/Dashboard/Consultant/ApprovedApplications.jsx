import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faCalendar, faTimes, faInfoCircle, faCheckDouble, faHourglassHalf, faBan } from "@fortawesome/free-solid-svg-icons";
import defaultImg from "../../../assets/society/society-1.jpg"; 

// --- DETAY POPUP (SADECE GÖRÜNTÜLEME) ---
const DetailsPopup = ({ onClose, event }) => {
    if (!event) return null;

    const formatDate = (dateString) => {
        if(!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    const formatTime = (timeString) => {
         if(!timeString) return "";
         return timeString.substring(0, 5);
    };

    const bgImage = event.image_url ? `http://localhost/student-automation-server/uploads/${event.image_url}` : defaultImg;

    // Duruma göre etiket rengi ve metni
    const getStatusInfo = (status) => {
        switch (status) {
            case 'approved': return { color: "bg-green-100 text-green-700", text: "Yönetim (SKS) Onayladı", icon: faCheckDouble };
            case 'pending_sks': return { color: "bg-blue-100 text-blue-700", text: "SKS Onayı Bekleniyor", icon: faHourglassHalf };
            case 'sks_rejected': return { color: "bg-red-100 text-red-700", text: "SKS Reddetti", icon: faBan };
            case 'advisor_rejected': return { color: "bg-red-100 text-red-700", text: "Danışman Reddetti", icon: faBan };
            default: return { color: "bg-gray-100 text-gray-700", text: "Durum Bilinmiyor", icon: faInfoCircle };
        }
    };

    const statusInfo = getStatusInfo(event.status);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative animate-fade-in overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10 transition-colors backdrop-blur-sm w-10 h-10 flex items-center justify-center cursor-pointer">
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                {/* Resim Alanı */}
                <div className="relative h-56 w-full">
                    <img src={bgImage} alt="Event" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 to-transparent p-6 pt-16">
                        <h1 className="text-white text-2xl font-bold">{event.title}</h1>
                        <p className="text-white/80 text-sm">{event.community_name}</p>
                    </div>
                </div>

                {/* İçerik */}
                <div className="p-6 overflow-y-auto">
                    
                    {/* Durum Göstergesi */}
                    <div className={`mb-6 p-3 rounded-xl flex items-center gap-3 ${statusInfo.color} font-semibold border border-current/10`}>
                        <FontAwesomeIcon icon={statusInfo.icon} />
                        <span>{statusInfo.text}</span>
                    </div>

                    {/* SKS Red Sebebi Varsa Göster */}
                    {event.status === 'sks_rejected' && event.rejection_reason && (
                        <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl text-red-800 text-sm">
                            <span className="font-bold">SKS Red Sebebi:</span> {event.rejection_reason}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400 text-lg" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Tarih</p>
                                <p className="font-medium text-gray-900">{formatDate(event.event_date)} | {formatTime(event.event_time)}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                            <FontAwesomeIcon icon={faLocation} className="text-gray-400 text-lg" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Konum</p>
                                <p className="font-medium text-gray-900">{event.location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Açıklama</h3>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {event.description || "Açıklama girilmemiş."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ANA BİLEŞEN ---
const ApprovedApplications = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const formatDate = (dateString) => {
        if(!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    const fetchEvents = (uId) => {
        console.log("İstek atılıyor UserID:", uId); // LOG 1
        
        // Danışman için özel endpoint
        fetch(`http://localhost/student-automation-server/get_advisor_approved_events.php?user_id=${uId}`)
            .then(res => res.text()) // Önce text olarak alalım hata görmek için
            .then(text => {
                console.log("GELEN HAM VERİ:", text); // LOG 2: PHP hatası varsa burada HTML görürsün
                try {
                    const data = JSON.parse(text);
                    console.log("PARSE EDİLMİŞ DATA:", data); // LOG 3
                    
                    if (data.success) {
                        setEvents(data.data);
                    } else {
                        console.error("API Başarısız:", data.message);
                    }
                } catch (e) {
                    console.error("JSON Parse Hatası:", e);
                }
            })
            .catch(err => console.error("Veri hatası:", err));
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const uId = parsedUser.user_id || parsedUser.id;
                
                // User ID kontrolü
                console.log("LocalStorage User:", parsedUser); 
                
                if (uId) {
                    fetchEvents(uId);
                } else {
                    console.error("User ID bulunamadı!");
                }
            } catch (error) { console.error("LocalStorage Parse Hatası:", error); }
        }
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': 
                return <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg">Yayında</span>;
            case 'pending_sks': 
                return <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">SKS Bekleniyor</span>;
            case 'sks_rejected': 
                return <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-lg">SKS Reddetti</span>;
            case 'advisor_rejected':
                return <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-lg">Danışman Reddetti</span>;
            default: return null;
        }
    };

    return (
        <>
            {selectedEvent && (
                <DetailsPopup 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)} 
                />
            )}

            <div className="w-full border-black/10 border bg-white rounded-xl shadow-md p-6 flex flex-col min-h-[200px] max-h-[600px] overflow-hidden my-4">
                <p className="text-black/80 font-semibold mb-4 text-lg">Onayladığım ve Süreci Devam Eden Etkinlikler</p>

                <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {events.length > 0 ? (
                        events.map((evt) => (
                            <div key={evt.event_id} className="bg-white border border-gray-100 rounded-xl p-4 mb-3 hover:shadow-md transition-shadow flex flex-row items-center justify-between group">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-[#062639] text-lg">{evt.title}</h3>
                                        {getStatusBadge(evt.status)}
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">{evt.community_name}</span>
                                    
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400"/>
                                            {formatDate(evt.event_date)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faLocation} className="text-gray-400"/>
                                            {evt.location}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <button 
                                        onClick={() => setSelectedEvent(evt)}
                                        className="px-5 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-[#062639] hover:text-white transition-colors text-sm cursor-pointer"
                                    >
                                        Detaylar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 opacity-60 text-center">
                            <FontAwesomeIcon icon={faCheckDouble} size="3x" className="mb-3 text-gray-300" />
                            <p className="text-gray-500">Henüz onayladığınız bir etkinlik yok.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ApprovedApplications;