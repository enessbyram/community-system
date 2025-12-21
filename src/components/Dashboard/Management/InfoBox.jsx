import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCalendar, faUser, faUserPlus, faBell } from "@fortawesome/free-solid-svg-icons";

const InfoBox = () => {
    const [stats, setStats] = useState({
        member_count: 0,        // Kişisel üyelikler
        total_members_count: 0, // Yönetilen topluluktaki üyeler
        pending_count: 0,       // Bekleyen başvurular
        event_count: 0          // Etkinlik sayısı
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.user_id || (parsedUser.user && parsedUser.user.user_id) || parsedUser.id;

                if (userId) {
                    const url = `http://localhost/student-automation-server/get_dashboard_stats.php?user_id=${userId}`;
                    fetch(url)
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                setStats({
                                    member_count: data.data.member_count,
                                    total_members_count: data.data.total_members_count,
                                    pending_count: data.data.pending_count,
                                    event_count: data.data.event_count
                                });
                            }
                        })
                        .catch(err => console.error("🔴 Fetch Hatası:", err));
                }
            } catch (error) {
                console.error("🔴 User verisi okunamadı:", error);
            }
        }
    }, []);

    return (
        <div className="py-4 w-full flex flex-row gap-4">
            {/* 1. Üye Olduğum (Kişisel) */}
            <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/5 transition hover:shadow-lg">
                <div className="bg-[#dbeafe] flex items-center justify-center text-black w-12 h-12 rounded-lg">
                    <FontAwesomeIcon icon={faUser} className="text-[#1e40af]" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm text-black/60">Üye Olduğum</p>
                    <h1 className="font-semibold text-2xl text-black">
                        {stats.member_count} Topluluk
                    </h1>
                </div>
            </div>

            {/* 2. Toplam Üye (Yönetilen Topluluk) */}
            <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/5 transition hover:shadow-lg">
                <div className="bg-[#fcdcdb] flex items-center justify-center w-12 h-12 rounded-lg">
                    <FontAwesomeIcon icon={faUsers} className="text-[#a60000]" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm text-black/60">Toplam Üye</p>
                    <h1 className="font-semibold text-2xl text-black">
                        {stats.total_members_count} 
                    </h1>
                </div>
            </div>

            {/* 3. Bekleyen Başvuru */}
            <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/5 transition hover:shadow-lg">
                <div className="bg-[#ffedd4] flex items-center justify-center w-12 h-12 rounded-lg">
                    <FontAwesomeIcon icon={faUserPlus} className="text-[#ffa953]" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm text-black/60">Bekleyen Başvuru</p>
                    <h1 className="font-semibold text-2xl text-black">
                        {stats.pending_count} 
                    </h1>
                </div>
            </div>

            {/* 4. Etkinlikler */}
            <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/5 transition hover:shadow-lg">
                <div className="bg-[#dbfce7] flex items-center justify-center w-12 h-12 rounded-lg">
                    <FontAwesomeIcon icon={faCalendar} className="text-[#00a63e]" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm text-black/60">Etkinlikler</p>
                    <h1 className="font-semibold text-2xl text-black">
                        {stats.event_count} 
                    </h1>
                </div>
            </div>

            {/* 5. Bildirimler (Bekleyen başvurularla aynı) */}
            <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/5 transition hover:shadow-lg">
                <div className="bg-[#f4dbfc] flex items-center justify-center w-12 h-12 rounded-lg">
                    <FontAwesomeIcon icon={faBell} className="text-[#8500a6]" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm text-black/60">Bildirimler</p>
                    <h1 className="font-semibold text-2xl text-black">
                        {stats.pending_count} 
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default InfoBox;