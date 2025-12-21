import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser, faUsers, faTimes, faCheck, faBan, faEye, faList } from "@fortawesome/free-solid-svg-icons";

// --- DANIŞMAN İÇİN DETAY POPUP ---
const AdvisorEventPopup = ({ isVisible, onClose, data, onApprove, onReject }) => {
    if (!isVisible || !data) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "Belirtilmemiş";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 relative animate-fade-in flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-[#062639]">Etkinlik Detayları</h2>
                        <p className="text-sm text-gray-500">Etkinlik bilgilerini inceleyin ve karar verin</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <h3 className="text-lg font-bold text-black mb-2">{data.title}</h3>
                    <div className="flex gap-2 mb-6">
                        <span className="bg-black text-white text-xs px-2 py-1 rounded-full uppercase font-bold">{data.event_type}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium border border-gray-200">{data.community_name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Tarih</p>
                            <p className="text-black">{formatDate(data.event_date)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Saat</p>
                            <p className="text-black">{data.event_time?.substring(0, 5)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Konum</p>
                            <p className="text-black">{data.location}</p>
                        </div>
                        {/* Katılımcı sayısı genelde tahmini olur, veride varsa ekle */}
                    </div>

                    <div className="mb-6">
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Açıklama</p>
                        <p className="text-black/80 text-sm leading-relaxed">{data.description}</p>
                    </div>

                    <div className="mb-6">
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">İhtiyaçlar & Talepler</p>
                        <p className="text-black/80 text-sm">{data.materials_needed || "Belirtilmemiş"}</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800">
                        <strong>Not:</strong> Bu etkinliği onaylamanız halinde doğrudan yöneticiye (SKS) iletilecektir.
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Kapat</button>
                    <button onClick={() => onReject(data)} className="px-4 py-2 bg-[#dc3545] text-white rounded-lg hover:bg-[#c82333] flex items-center gap-2">
                        <FontAwesomeIcon icon={faBan} /> Reddet
                    </button>
                    <button onClick={() => onApprove(data.application_id)} className="px-4 py-2 bg-[#198754] text-white rounded-lg hover:bg-[#157347] flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheck} /> Onayla ve Yönetime İlet
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ANA COMPONENT ---
const EventDetails = () => {
    const [role, setRole] = useState("student");
    const [userId, setUserId] = useState(null);
    
    // Öğrenci State'leri
    const [memberships, setMemberships] = useState([]);
    const [requests, setRequests] = useState([]);
    
    // Danışman State'leri
    const [pendingEvents, setPendingEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // Detay popup için
    const [showRejectModal, setShowRejectModal] = useState(false); // Reddetme popup
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const uId = parsedUser.user_id || parsedUser.id;
                const uRole = parsedUser.role || "student";
                
                setUserId(uId);
                setRole(uRole);

                if (uId) {
                    if (uRole === 'advisor' || uRole === 'sks') {
                        // Danışman ise bekleyen etkinlikleri çek
                        fetch(`http://localhost/student-automation-server/get_pending_events.php?user_id=${uId}`)
                            .then(res => res.json())
                            .then(data => { if(data.success) setPendingEvents(data.data); })
                            .catch(err => console.error(err));
                    } else {
                        // Öğrenci ise üyelikleri çek (Eski kod)
                        fetch(`http://localhost/student-automation-server/get_member_communities.php?user_id=${uId}`)
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    setMemberships(data.data.memberships);
                                    setRequests(data.data.requests);
                                }
                            })
                            .catch(err => console.error(err));
                    }
                }
            } catch (error) { console.error(error); }
        }
    }, []);

    // --- DANIŞMAN FONKSİYONLARI ---
    const handleApprove = (appId) => {
        if(window.confirm("Bu etkinliği onaylamak istediğinize emin misiniz?")) {
            updateStatus(appId, 'approve');
        }
    };

    const handleRejectClick = (event) => {
        setSelectedEvent(event); // Hangi etkinliğin reddedildiğini tut
        setShowRejectModal(true); // Modal'ı aç
    };

    const confirmReject = () => {
        if(!rejectReason) { 
            alert("Lütfen bir sebep belirtin."); 
            return; 
        }
        
        if (!selectedEvent || !selectedEvent.application_id) {
            alert("Seçili etkinlik bilgisi kayboldu. Lütfen sayfayı yenileyip tekrar deneyin.");
            return;
        }

        updateStatus(selectedEvent.application_id, 'reject', rejectReason);
    };

    const updateStatus = (appId, action, reason = "") => {
        // Konsola ne gönderdiğimizi basalım (F12 -> Console'dan kontrol edebilirsin)
        console.log("Gönderilen Veri:", { application_id: appId, action, reason });

        fetch("http://localhost/student-automation-server/update_event_status.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ application_id: appId, action, reason })
        })
        .then(res => {
            // Eğer sunucudan JSON harici bir şey (PHP hatası, HTML vb.) dönerse yakalayalım
            if (!res.ok) {
                throw new Error("Sunucu hatası: " + res.status);
            }
            return res.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error("Gelen yanıt JSON değil:", text);
                    throw new Error("Sunucudan geçerli bir yanıt alınamadı. PHP hatası olabilir.");
                }
            });
        })
        .then(data => {
            if(data.success) {
                alert("İşlem başarılı!");
                // Listeden ilgili etkinliği kaldır
                setPendingEvents(prev => prev.filter(e => e.application_id !== appId));
                // Modalları kapat ve temizle
                setSelectedEvent(null);
                setShowRejectModal(false);
                setRejectReason("");
            } else {
                alert("Hata: " + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Bir hata oluştu: " + err.message);
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    if (role === 'advisor' || role === 'sks') {
        return (
            <>
                <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-black/80">Bekleyen Etkinlik Talepleri</h2>
                        {pendingEvents.length > 0 && <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-full font-bold">{pendingEvents.length} Talep</span>}
                    </div>

                    <div className="flex flex-col gap-4">
                        {pendingEvents.length > 0 ? (
                            pendingEvents.map((evt) => (
                                <div key={evt.application_id} className="border border-gray-100 rounded-xl p-4 flex flex-row justify-between items-center hover:bg-gray-50 transition shadow-sm">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-[#062639]">{evt.title}</h3>
                                            <span className="text-xs bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-600">{evt.event_type}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-1">{evt.community_name}</p>
                                        <div className="text-xs text-gray-400 flex gap-3">
                                            <span><FontAwesomeIcon icon={faClock} /> {formatDate(evt.event_date)} • {evt.event_time?.substring(0,5)}</span>
                                            <span>Gönderildi: {formatDate(evt.created_at)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setSelectedEvent(evt)} 
                                            className="px-3 py-1.5 border border-gray-300 bg-white text-gray-600 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <FontAwesomeIcon icon={faEye} /> İncele
                                        </button>
                                        <button 
                                            onClick={() => handleApprove(evt.application_id)}
                                            className="px-3 py-1.5 bg-[#198754] text-white text-sm rounded-lg hover:bg-[#157347] flex items-center gap-2"
                                        >
                                            <FontAwesomeIcon icon={faCheck} /> Onayla
                                        </button>
                                        <button 
                                            onClick={() => handleRejectClick(evt)}
                                            className="px-3 py-1.5 bg-[#dc3545] text-white text-sm rounded-lg hover:bg-[#c82333] flex items-center gap-2"
                                        >
                                            <FontAwesomeIcon icon={faBan} /> Reddet
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400">Bekleyen etkinlik talebi bulunmuyor.</div>
                        )}
                    </div>
                </div>

                {/* DETAY POPUP */}
                <AdvisorEventPopup 
                    isVisible={!!selectedEvent && !showRejectModal} 
                    onClose={() => setSelectedEvent(null)}
                    data={selectedEvent}
                    onApprove={handleApprove}
                    onReject={handleRejectClick}
                />

                {/* REDDETME POPUP */}
                {showRejectModal && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4 animate-fade-in">
                            <h3 className="text-lg font-bold text-[#062639] mb-4">Etkinliği Reddet</h3>
                            <textarea 
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 mb-4 text-black"
                                rows="4"
                                placeholder="Lütfen reddetme sebebini giriniz..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => { setShowRejectModal(false); setRejectReason(""); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">İptal</button>
                                <button onClick={confirmReject} className="px-4 py-2 bg-[#dc3545] text-white rounded-lg hover:bg-[#c82333]">Reddet</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default EventDetails;