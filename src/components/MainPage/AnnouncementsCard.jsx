import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons"; // faLocation yerine faLocationDot daha güncel olabilir

const AnnouncementsCard = ({ title, date, time, location }) => {
    
    // Tarih formatlama yardımcıları
    const eventDate = new Date(date);
    
    // Ay ismi (Örn: AĞU)
    const monthName = eventDate.toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase().replace('.', '');
    // Gün sayısı (Örn: 24)
    const dayNumber = eventDate.getDate();
    // Gün adı (Örn: Perşembe)
    const dayName = eventDate.toLocaleDateString('tr-TR', { weekday: 'long' });

    // Saat formatlama (Saniye kısmını atmak için)
    const formattedTime = time ? time.substring(0, 5) : "";

    return (
        <div className="flex flex-row w-full h-32 border border-black/10 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 items-center gap-4 p-4">
            {/* Tarih Kutusu */}
            <div className="text-xl flex flex-col bg-[#FF9933] text-white rounded-lg items-center justify-center h-24 w-24 min-w-6rem shadow-sm">
                <p className="text-sm font-bold opacity-90">{monthName}</p>
                <p className="text-3xl font-extrabold leading-none my-1">{dayNumber}</p>
                <p className="text-xs font-medium opacity-90">{dayName}</p>
            </div>
            
            {/* İçerik */}
            <div className="text-black flex flex-col justify-between h-24 py-1 w-full overflow-hidden">
                <div>
                    <h3 className="font-bold text-lg leading-tight truncate" title={title}>
                        {title}
                    </h3>
                </div>
                
                <div className="flex flex-col gap-1 text-sm text-black/60 mt-auto">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-[#FF9933]" />
                        <span>{formattedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faLocationDot} className="text-[#FF9933]" />
                        <span className="truncate max-w-15rem">{location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsCard;