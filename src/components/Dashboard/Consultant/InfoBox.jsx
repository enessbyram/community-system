import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCheckCircle, faFileAlt, faUserPlus, faBell, faUser } from "@fortawesome/free-solid-svg-icons";

const InfoBox = () => {
    const [role, setRole] = useState("student");
    const [stats, setStats] = useState({
        member_count: 0,
        total_members_count: 0,
        pending_count: 0,
        event_count: 0,
        approved_count: 0,
        this_month_count: 0
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log("1️⃣ LocalStorage Ham Veri:", storedUser); // LOG 1

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.user_id || parsedUser.id;
                const userRole = parsedUser.role || "student";
                
                console.log("2️⃣ Parsed User ID:", userId); // LOG 2
                console.log("3️⃣ User Role:", userRole);   // LOG 3

                setRole(userRole);

                if (userId) {
                    const endpoint = (userRole === 'advisor' || userRole === 'sks') 
                        ? `http://localhost/student-automation-server/get_advisor_stats.php?user_id=${userId}`
                        : `http://localhost/student-automation-server/get_dashboard_stats.php?user_id=${userId}`;

                    console.log("4️⃣ İstek Atılan URL:", endpoint); // LOG 4

                    fetch(endpoint)
                        .then(res => res.text()) // Önce text olarak alalım, hata varsa görelim
                        .then(text => {
                            console.log("5️⃣ Sunucudan Gelen Ham Cevap:", text); // LOG 5
                            try {
                                const data = JSON.parse(text);
                                console.log("6️⃣ Parsed JSON Data:", data); // LOG 6

                                if (data.success) {
                                    if (userRole === 'advisor' || userRole === 'sks') {
                                        setStats({
                                            pending_count: data.data.pending,
                                            approved_count: data.data.approved,
                                            this_month_count: data.data.this_month
                                        });
                                    } else {
                                        setStats({
                                            member_count: data.data.member_count,
                                            total_members_count: data.data.total_members_count,
                                            pending_count: data.data.pending_count,
                                            event_count: data.data.event_count
                                        });
                                    }
                                } else {
                                    console.error("❌ Sunucu success: false döndü:", data.message);
                                    // Eğer debug bilgisi varsa onu da yazdır
                                    if(data.debug) console.warn("🔍 Backend Debug Bilgisi:", data.debug);
                                }
                            } catch (e) {
                                console.error("❌ JSON Parse Hatası:", e);
                            }
                        })
                        .catch(err => console.error("❌ Fetch (Ağ) Hatası:", err));
                }
            } catch (error) {
                console.error("❌ User verisi okunamadı:", error);
            }
        }
    }, []);

    if (role === 'advisor' || role === 'sks') {
        return (
            <div className="py-4 w-full flex flex-row gap-4">
                <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/3 transition hover:shadow-lg">
                    <div className="bg-[#fff9c4] flex items-center justify-center w-12 h-12 rounded-lg">
                        <FontAwesomeIcon icon={faFileAlt} className="text-[#fbc02d]" />
                    </div>
                    <div className="flex flex-col items-start justify-start">
                        <p className="text-sm text-black/60">Bekleyen Talepler</p>
                        <h1 className="font-semibold text-2xl text-black">{stats.pending_count}</h1>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/3 transition hover:shadow-lg">
                    <div className="bg-[#e8f5e9] flex items-center justify-center w-12 h-12 rounded-lg">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-[#43a047]" />
                    </div>
                    <div className="flex flex-col items-start justify-start">
                        <p className="text-sm text-black/60">Onaylanan</p>
                        <h1 className="font-semibold text-2xl text-black">{stats.approved_count}</h1>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-4 bg-white border border-black/10 px-6 py-4 rounded-xl shadow-md w-1/3 transition hover:shadow-lg">
                    <div className="bg-[#e3f2fd] flex items-center justify-center w-12 h-12 rounded-lg">
                        <FontAwesomeIcon icon={faCalendar} className="text-[#1e88e5]" />
                    </div>
                    <div className="flex flex-col items-start justify-start">
                        <p className="text-sm text-black/60">Bu Ay</p>
                        <h1 className="font-semibold text-2xl text-black">{stats.this_month_count}</h1>
                    </div>
                </div>
            </div>
        );
    }
}
export default InfoBox;