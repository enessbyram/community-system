import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus, faInfoCircle } from "@fortawesome/free-solid-svg-icons"; // faInfoCircle eklendi
import AddEventPopup from '../AddEventPopup';

const DashboardBox = () => {
    const [requests, setRequests] = useState([]);
    const [events, setEvents] = useState([]);
    const [showEventPopup, setShowEventPopup] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    const fetchData = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.user_id || parsedUser.id;

                if (userId) {
                    fetch(`http://localhost/student-automation-server/get_management_data.php?user_id=${userId}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                setRequests(data.data.requests);
                                setEvents(data.data.events);
                            }
                        })
                        .catch(err => console.error(err));
                }
            } catch (error) { console.error(error); }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRequest = (requestId, action) => {
        fetch("http://localhost/student-automation-server/handle_request.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ request_id: requestId, action: action })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setRequests(prev => prev.filter(req => req.request_id !== requestId));
                alert(action === 'approve' ? "Üye onaylandı!" : "Başvuru reddedildi.");
            } else {
                alert("Hata: " + data.message);
            }
        })
        .catch(err => console.error(err));
    };

    // GÜNCELLENDİ: Artık advisor_rejected ve sks_rejected durumlarını tanıyor
    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return "bg-green-100 text-green-700";
            case 'rejected': 
            case 'advisor_rejected': // Danışman reddetti
            case 'sks_rejected':     // SKS reddetti
                return "bg-red-100 text-red-700";
            case 'pending_sks':      // Danışman onayladı, SKS bekliyor (Opsiyonel: Mavi yapabilirsin)
                return "bg-blue-100 text-blue-700";
            default: return "bg-yellow-100 text-yellow-700";
        }
    };

    // GÜNCELLENDİ: Ekranda doğru yazıyı gösteriyor
    const getStatusText = (status) => {
        switch (status) {
            case 'approved': return "Onaylandı";
            case 'rejected': return "Reddedildi";
            case 'advisor_rejected': return "Danışman Reddetti";
            case 'sks_rejected': return "SKS Reddetti";
            case 'pending_sks': return "SKS Onayı Bekliyor";
            case 'pending_advisor': return "Danışman Bekliyor";
            default: return "Bekliyor";
        }
    };

    return (
        <>
            <div className="py-2 w-full flex flex-row gap-4 items-start h-auto">
                {/* Bekleyen Başvurular Kutusu */}
                <div className="w-1/2 border-black/10 border bg-white rounded-xl shadow-md p-6 flex flex-col max-h-100 min-h-50">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-black/80 font-semibold">Bekleyen Üyelik Başvuruları</p>
                        {requests.length > 0 && (
                            <span className="bg-orange-400 text-white text-xs px-2 py-1 rounded-full">{requests.length}</span>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {requests.length > 0 ? (
                            requests.map((req) => (
                                <div key={req.request_id} className="bg-[#f9fafb] mb-3 shadow-sm border border-gray-100 w-full rounded-xl flex flex-row items-center justify-between p-4">
                                    <div className="flex flex-col">
                                        <p className="text-black font-medium">{req.full_name}</p>
                                        <p className="text-black/50 text-sm">{req.email}</p>
                                        <p className="text-gray-400 text-xs mt-1">{formatDate(req.request_date)}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleRequest(req.request_id, 'approve')}
                                            className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
                                        >
                                            Onayla
                                        </button>
                                        <button 
                                            onClick={() => handleRequest(req.request_id, 'reject')}
                                            className="bg-[#D32F2F] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
                                        >
                                            Reddet
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-50 text-black/50">
                                <p>Bekleyen başvuru yok.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gönderilen Etkinlikler Kutusu */}
                <div className="w-1/2 border-black/10 border bg-white rounded-xl shadow-md p-6 flex flex-col max-h-100 min-h-50">
                    <p className="text-black/80 font-semibold mb-4">Gönderilen Etkinlikler</p>
                    
                    <div className="flex-1 overflow-y-auto pr-2 mb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {events.length > 0 ? (
                            events.map((evt) => (
                                <div key={evt.event_id} className="bg-[#f9fafb] mb-3 shadow-sm border border-gray-100 w-full rounded-xl flex flex-col p-4">
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <div className="flex flex-col">
                                            <p className="text-black font-medium">{evt.title || evt.event_name}</p>
                                            <p className="text-black/50 text-sm">Gönderildi: {formatDate(evt.created_at)}</p>
                                        </div>
                                        <div>
                                            <span className={`${getStatusStyle(evt.status)} text-xs px-3 py-1 rounded-full font-semibold`}>
                                                {getStatusText(evt.status)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* YENİ EKLENEN KISIM: Red Sebebi Gösterimi */}
                                    {(evt.status === 'advisor_rejected' || evt.status === 'sks_rejected') && evt.rejection_reason && (
                                        <div className="mt-3 bg-red-50 border border-red-100 p-2 rounded-lg text-xs text-red-700 flex gap-2 items-start">
                                            <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
                                            <div>
                                                <span className="font-bold">Red Sebebi:</span> {evt.rejection_reason}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-50 text-black/50">
                                <p>Henüz etkinlik gönderilmedi.</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => setShowEventPopup(true)}
                        className="w-full bg-[#062639] text-white py-3 cursor-pointer rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#08415a] transition shadow-md"
                    >
                        <FontAwesomeIcon icon={faCalendarPlus} /> Yeni Etkinlik Ekle
                    </button>
                </div>
            </div>

            <AddEventPopup 
                isVisible={showEventPopup} 
                onClose={() => setShowEventPopup(false)} 
            />
        </>
    );
};

export default DashboardBox;