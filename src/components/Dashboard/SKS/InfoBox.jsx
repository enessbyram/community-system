import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faChartLine, faCalendar, faFileLines } from "@fortawesome/free-solid-svg-icons";

const InfoBox = () => {
    // State yapısı
    const [stats, setStats] = useState({
        total_communities: 0, 
        total_members: 0,     
        pending_events: 0,    
        pending_documents: 0  
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            const url = `http://localhost/student-automation-server/get_sks_dashboard_stats.php`;
            
            fetch(url)
                .then(res => {
                    return res.text(); // Önce text olarak alalım, JSON hatası varsa görelim
                })
                .then(text => {
                    try {
                        const data = JSON.parse(text); // Manuel parse ediyoruz

                        if (data.success) {
                            setStats({
                                total_communities: data.data.total_communities || 0,
                                total_members: data.data.total_members || 0,
                                pending_events: data.data.pending_events || 0,
                                pending_documents: data.data.pending_documents || 0
                            });
                        } else {
                        }
                    } catch (e) {
                        console.error("❌ JSON Parse Hatası! Gelen veri JSON formatında değil:", e);
                        console.error("Hatalı veri içeriği:", text);
                    }
                })
                .catch(err => console.error("🔴 Fetch (Ağ) Hatası:", err));
        } else {
            console.warn("⚠️ Kullanıcı girişi yapılmamış (localStorage boş), istek atılmadı.");
        }
    }, []);

    // Kartların yapılandırması
    const cards = [
        {
            id: 1,
            label: "Toplam Topluluk",
            value: stats.total_communities,
            icon: faUsers,
            bgColor: "bg-[#eff6ff]", // Light Blue
            iconColor: "text-[#1d4ed8]" // Blue
        },
        {
            id: 2,
            label: "Toplam Üye",
            value: stats.total_members.toLocaleString(),
            icon: faChartLine,
            bgColor: "bg-[#dcfce7]", // Light Green
            iconColor: "text-[#15803d]" // Green
        },
        {
            id: 3,
            label: "Bekleyen Etkinlik",
            value: stats.pending_events,
            icon: faCalendar,
            bgColor: "bg-[#ffedd5]", // Light Orange
            iconColor: "text-[#c2410c]" // Orange
        },
        {
            id: 4,
            label: "Bekleyen Belge",
            value: stats.pending_documents,
            icon: faFileLines,
            bgColor: "bg-[#f3e8ff]", // Light Purple
            iconColor: "text-[#7e22ce]" // Purple
        }
    ];

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
            {cards.map((card) => (
                <div 
                    key={card.id} 
                    className="flex flex-row items-center gap-4 bg-white border border-gray-200 px-6 py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                    <div className={`${card.bgColor} flex items-center justify-center w-12 h-12 rounded-xl`}>
                        <FontAwesomeIcon icon={card.icon} className={`${card.iconColor} text-lg`} />
                    </div>
                    
                    <div className="flex flex-col items-start justify-center">
                        <p className="text-sm font-medium text-gray-500 mb-0.5">{card.label}</p>
                        <h1 className="font-bold text-2xl text-gray-900 leading-none">
                            {card.value}
                        </h1>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default InfoBox;