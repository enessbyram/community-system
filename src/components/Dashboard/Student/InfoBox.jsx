import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";

const InfoBox = () => {
    const [stats, setStats] = useState({
        member_count: 0,
        pending_count: 0,
        event_count: 0
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // ID yakalama mantığı
                const userId = parsedUser.user_id || (parsedUser.user && parsedUser.user.user_id) || parsedUser.id;

                if (userId) {
                    console.log("İstek atılan User ID:", userId); // DEBUG 1

                    const url = `http://localhost/student-automation-server/get_dashboard_stats.php?user_id=${userId}`;
                    
                    fetch(url)
                        .then(res => res.json()) // .text() yerine doğrudan .json() kullanıyoruz
                        .then(data => {
                            console.log("API'den Gelen Cevap:", data); // DEBUG 2: Buraya dikkat et

                            if (data.success) {
                                setStats({
                                    member_count: data.data.member_count || 0,
                                    pending_count: data.data.pending_count || 0,
                                    event_count: data.data.event_count || 0
                                });
                            } else {
                                console.error("API success:false döndü:", data.message);
                            }
                        })
                        .catch(err => console.error("🔴 Fetch Hatası:", err));
                } else {
                    console.warn("🔴 User ID bulunamadı! LocalStorage yapısını kontrol et.");
                }
            } catch (error) {
                console.error("🔴 User verisi okunamadı:", error);
            }
        } else {
            console.warn("🔴 LocalStorage boş.");
        }
    }, []);

    return (
        <div className="py-4 w-full flex flex-row gap-4">
            {/* Üye Olunan Topluluklar */}
            <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/3 transition hover:shadow-lg">
                <div className="bg-[#dbeafe] flex items-center justify-center text-black w-12 h-12 rounded-lg">
                    <FontAwesomeIcon icon={faUsers} className="text-[#1e40af]" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm text-black/60">Üye Olduğum</p>
                    <h1 className="font-semibold text-2xl text-black">
                        {stats.member_count} Topluluk
                    </h1>
                </div>
            </div>

            {/* Bekleyen Başvurular */}
            <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/3 transition hover:shadow-lg">
                <div className="bg-[#ffedd4] flex items-center justify-center w-12 h-12 rounded-lg">
                    <FontAwesomeIcon icon={faClock} className="text-[#ffa953]" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm text-black/60">Bekleyen Başvuru</p>
                    <h1 className="font-semibold text-2xl text-black">
                        {stats.pending_count} Adet
                    </h1>
                </div>
            </div>

            {/* Yaklaşan Etkinlikler */}
            <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/3 transition hover:shadow-lg">
                <div className="bg-[#dbfce7] flex items-center justify-center w-12 h-12 rounded-lg">
                    <FontAwesomeIcon icon={faCalendar} className="text-[#00a63e]" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm text-black/60">Yaklaşan Etkinlik</p>
                    <h1 className="font-semibold text-2xl text-black">
                        {stats.event_count} Adet
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default InfoBox;