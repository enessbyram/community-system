import { useState, useEffect } from "react";
import AnnouncementsCard from "./AnnouncementsCard.jsx";

const Announcements = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🟢 Announcements bileşeni yüklendi. Veri çekme başlıyor...");

        fetch("http://localhost/student-automation-server/get_recent_announcements.php")
            .then(res => {
                console.log("1. Sunucu Yanıt Durumu (Status):", res.status);
                // JSON yerine önce text alıyoruz ki PHP hatası varsa görelim
                return res.text(); 
            })
            .then(text => {
                console.log("2. Sunucudan Gelen HAM Veri:", text);

                try {
                    const data = JSON.parse(text);
                    console.log("3. Parse Edilen JSON Verisi:", data);

                    if (data.success) {
                        console.log("✅ Success True. Gelen Etkinlik Sayısı:", data.data.length);
                        console.log("📄 Etkinlik Listesi:", data.data);
                        
                        if (data.data.length === 0) {
                            console.warn("⚠️ Veri başarılı döndü ama liste BOŞ. Tarih filtrelerine veya onay durumuna takılıyor olabilir.");
                        }

                        setEvents(data.data);
                    } else {
                        console.error("❌ Backend 'success: false' döndürdü. Mesaj:", data.message);
                    }
                } catch (e) {
                    console.error("❌ JSON Parse Hatası! Gelen veri bozuk olabilir:", e);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("🔴 Ağ Hatası (Fetch):", err);
                setLoading(false);
            });
    }, []);

    const handleSeeAll = () => {
        console.log("Tüm duyurular sayfasına yönlendirilecek...");
    };

    return (
        <div className="w-full flex items-center justify-center py-10">
            <div className="container w-full flex flex-col px-4 md:px-0">
                <h1 className="text-3xl font-bold text-[#062639] mb-6 border-l-4 border-[#FF9933] pl-4">
                    Duyurular & Etkinlikler
                </h1>
                
                {loading ? (
                    <div className="w-full text-center py-10 text-gray-500">Yükleniyor...</div>
                ) : (
                    <>
                        {events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                {events.map((evt) => (
                                    <AnnouncementsCard 
                                        key={evt.event_id}
                                        title={evt.event_name}
                                        date={evt.event_date}
                                        time={evt.event_time}
                                        location={evt.location}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="w-full text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                                Şu an planlanmış güncel bir duyuru veya etkinlik bulunmamaktadır.
                                <br/>
                            </div>
                        )}
                    </>
                )}

                {events.length >= 4 && (
                    <div className="w-full flex items-center justify-center mt-8">
                        <button 
                            onClick={handleSeeAll}
                            className="bg-[#FF9933] text-white rounded-lg px-6 py-3 cursor-pointer hover:bg-[#e68a00] transition duration-200 font-semibold shadow-md"
                        >
                            Tüm Duyuruları Gör
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;