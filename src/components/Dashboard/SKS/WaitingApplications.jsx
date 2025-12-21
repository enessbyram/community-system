import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCheck, 
    faTimes, 
    faEye, 
    faCalendarCheck, 
    faFileLines, 
    faCalendar, 
    faMapMarkerAlt, 
    faUsers, 
    faClock 
} from "@fortawesome/free-solid-svg-icons";

// --- 1. POPUP BİLEŞENİ ---
const EventApprovalPopup = ({ event, onClose, onProcess }) => {
    if (!event) return null;

    const formatDateTime = (dateString) => {
        if (!dateString) return { date: "Tarih Yok", time: "--:--" };
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('tr-TR'),
            time: date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const { date, time } = formatDateTime(event.event_date);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-[#062639] p-6 flex items-center justify-between">
                    <div>
                        <div className="bg-white/10 text-white text-xs px-2 py-1 rounded inline-block mb-2">
                            {event.community_name || "Topluluk Adı"}
                        </div>
                        <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition cursor-pointer">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-[#eff6ff] p-4 rounded-xl flex items-start gap-4">
                            <div className="bg-[#dbeafe] w-10 h-10 flex items-center justify-center rounded-lg text-[#1e40af]">
                                <FontAwesomeIcon icon={faCalendar} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase">Tarih & Saat</p>
                                <p className="text-gray-900 font-bold text-lg">{date} • {time}</p>
                            </div>
                        </div>
                        <div className="bg-[#fff7ed] p-4 rounded-xl flex items-start gap-4">
                            <div className="bg-[#ffedd5] w-10 h-10 flex items-center justify-center rounded-lg text-[#c2410c]">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase">Konum</p>
                                <p className="text-gray-900 font-bold text-lg">{event.location || "Konum Belirtilmedi"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f0fdf4] p-4 rounded-xl flex items-start gap-4 mb-6">
                        <div className="bg-[#dcfce7] w-10 h-10 flex items-center justify-center rounded-lg text-[#15803d]">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-semibold uppercase">Katılımcılar</p>
                            <p className="text-gray-900 font-bold text-lg">
                                {event.participant_count || "0"} kişi katılacak
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-gray-900 font-bold text-lg mb-3">
                            <FontAwesomeIcon icon={faClock} className="text-gray-400" /> Etkinlik Hakkında
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed text-sm">
                            {event.description || "Açıklama bulunmuyor."}
                        </div>
                    </div>

                    <div className="bg-[#f8fafc] border-l-4 border-[#062639] p-4 rounded-r-xl">
                        <p className="text-sm text-gray-800">
                            <span className="font-bold">Gönderen:</span> {event.sender_name || "Bilinmiyor"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="font-bold">İşlem Tarihi:</span> {new Date().toLocaleDateString('tr-TR')}
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
                    <button 
                        onClick={() => onProcess(event.event_id, 'approve')}
                        className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faCheck} /> Etkinliği Onayla
                    </button>
                    <button 
                        onClick={() => onProcess(event.event_id, 'reject')}
                        className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faTimes} /> Etkinliği Reddet
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 2. ANA BİLEŞEN ---
const WaitingApplications = () => {
    const [pendingEvents, setPendingEvents] = useState([]);
    const [pendingDocuments, setPendingDocuments] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Verileri API'den Çekme (DEBUG EKLENDİ)
    const fetchPendingData = () => {
        console.log("🟢 Veri çekme işlemi başladı...");
        const storedUser = localStorage.getItem('user');
        console.log("1. LocalStorage User:", storedUser);

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.user_id || parsedUser.id;
                console.log("2. Tespit edilen User ID:", userId);

                if (userId) {
                    const url = `http://localhost/student-automation-server/get_sks_pending_approvals.php?user_id=${userId}`;
                    console.log("3. İstek URL'i:", url);

                    fetch(url)
                        .then(res => {
                            console.log("4. Sunucu Yanıt Kodu:", res.status);
                            return res.text(); // JSON yerine Text alıyoruz hatayı görmek için
                        })
                        .then(text => {
                            console.log("5. Sunucudan Gelen HAM Veri:", text);
                            try {
                                const data = JSON.parse(text);
                                console.log("6. Parse Edilen JSON:", data);

                                if (data.success) {
                                    console.log("✅ Success True. Events:", data.data.events);
                                    setPendingEvents(data.data.events || []);
                                    setPendingDocuments(data.data.documents || []);
                                } else {
                                    console.warn("⚠️ Success False Döndü:", data.message);
                                }
                            } catch (e) {
                                console.error("❌ JSON Parse Hatası (Muhtemelen PHP hatası var):", e);
                            }
                        })
                        .catch(err => console.error("🔴 Ağ Hatası (Fetch):", err));
                }
            } catch (error) {
                console.error("User Parse hatası:", error);
            }
        } else {
            console.warn("User verisi bulunamadı.");
        }
    };

    // Sayfa ilk açıldığında verileri çek
    useEffect(() => {
        fetchPendingData();
    }, []);

    // Onay / Ret İşlemi
    const handleProcessEvent = async (eventId, action) => {
        const actionText = action === 'approve' ? 'onaylamak' : 'reddetmek';
        if (!window.confirm(`Bu etkinliği ${actionText} istediğinize emin misiniz?`)) return;

        console.log(`İşlem Başlatılıyor: ID=${eventId}, Action=${action}`);

        try {
            const res = await fetch("http://localhost/student-automation-server/update_event_status.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_id: eventId, action: action })
            });
            
            const text = await res.text();
            console.log("Update Yanıtı:", text);
            const data = JSON.parse(text);

            if (data.success) {
                alert(`İşlem başarılı! Etkinlik durumu: ${data.new_status}`);
                setSelectedEvent(null); // Popup kapat
                fetchPendingData();     // Listeyi yenile
            } else {
                alert("Hata: " + data.message);
            }
        } catch (error) {
            console.error("İşlem hatası:", error);
            alert("Sunucu ile iletişim kurulurken bir hata oluştu.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    return (
        <>
            {selectedEvent && (
                <EventApprovalPopup 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)} 
                    onProcess={handleProcessEvent}
                />
            )}

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                
                {/* SOL KUTU: Bekleyen Etkinlikler */}
                <div className="bg-white border border-black/10 rounded-xl shadow-sm p-6 flex flex-col h-auto max-h-150 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-gray-900 font-semibold text-lg">Bekleyen Etkinlik Onayları</h2>
                        <span className="bg-[#ea580c] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                            {pendingEvents.length}
                        </span>
                    </div>

                    <div className="overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {pendingEvents.length > 0 ? (
                            pendingEvents.map((event, index) => (
                                <div key={index} className="bg-[#F9FAFB] border border-gray-100 p-5 rounded-xl hover:border-gray-300 transition-colors">
                                    <div className="mb-3">
                                        <h3 className="font-bold text-gray-900 text-base">{event.title}</h3>
                                        <p className="text-gray-500 text-sm font-medium">{event.community_name}</p>
                                        <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                                            <p>Gönderen: <span className="text-gray-600">{event.sender_name}</span></p>
                                            <p>Tarih: <span className="text-gray-600">{formatDate(event.event_date)}</span></p>
                                        </div>
                                        <p className="text-gray-700 text-sm mt-3 leading-relaxed line-clamp-2">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-row gap-3 mt-4">
                                        <button 
                                            onClick={() => setSelectedEvent(event)}
                                            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faEye} /> İncele
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleProcessEvent(event.event_id, 'approve')}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faCheck} /> Onayla
                                        </button>
                                        <button 
                                            onClick={() => handleProcessEvent(event.event_id, 'reject')}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faTimes} /> Reddet
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 opacity-50">
                                <FontAwesomeIcon icon={faCalendarCheck} size="2x" className="mb-3 text-gray-400" />
                                <p className="text-sm text-gray-500">Bekleyen etkinlik onayı yok.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* SAĞ KUTU: Bekleyen Belgeler (Pasif) */}
                <div className="bg-white border border-black/10 rounded-xl shadow-sm p-6 flex flex-col h-auto max-h-150 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-gray-900 font-semibold text-lg">Bekleyen Belge Onayları</h2>
                        <span className="bg-[#9333ea] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                            {pendingDocuments.length}
                        </span>
                    </div>

                    <div className="overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {pendingDocuments.length > 0 ? (
                            pendingDocuments.map((doc, index) => (
                                <div key={index} className="bg-[#F9FAFB] border border-gray-100 p-5 rounded-xl hover:border-gray-300 transition-colors">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-gray-900 text-base">{doc.title}</h3>
                                        <p className="text-gray-500 text-sm font-medium">{doc.community_name}</p>
                                        <div className="text-xs text-gray-400 mt-1">
                                            <p>Gönderen: <span className="text-gray-600">{doc.sender_name} • {formatDate(doc.created_at)}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-3">
                                        <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-sm cursor-not-allowed opacity-50">
                                            <FontAwesomeIcon icon={faEye} /> Görüntüle
                                        </button>
                                        <button className="w-11 h-11 flex items-center justify-center bg-[#22c55e] opacity-50 text-white rounded-lg transition shadow-sm cursor-not-allowed">
                                            <FontAwesomeIcon icon={faCheck} size="lg" />
                                        </button>
                                        <button className="w-11 h-11 flex items-center justify-center bg-[#ef4444] opacity-50 text-white rounded-lg transition shadow-sm cursor-not-allowed">
                                            <FontAwesomeIcon icon={faTimes} size="lg" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 opacity-50">
                                <FontAwesomeIcon icon={faFileLines} size="2x" className="mb-3 text-gray-400" />
                                <p className="text-sm text-gray-500">Bekleyen belge onayı yok.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}

export default WaitingApplications;