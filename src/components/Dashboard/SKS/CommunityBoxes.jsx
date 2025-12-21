import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTimes, faUsers } from "@fortawesome/free-solid-svg-icons";

// Yardımcı Fonksiyon: Role ID'den İsim Döndür
const getRoleName = (roleId) => {
    const id = parseInt(roleId);
    switch (id) {
        case 1: return "Başkan";
        case 2: return "Başkan Yardımcısı";
        case 3: return "Sekreter";
        case 4: return "Sayman";
        case 10: return "Üye";
        default: return "Üye";
    }
};

// --- 1. POPUP: TÜM ÜYELER LİSTESİ ---
const AllMembersPopup = ({ community, members, onClose, onBack }) => {
    if (!community) return null;

    console.log("👥 AllMembersPopup Rendered. Members count:", members?.length);

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl relative flex flex-col max-h-[85vh]">
                
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition cursor-pointer"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <div className="p-8 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{community.name} - Tüm Üyeler</h2>
                    <p className="text-gray-500 text-sm mt-1">Topluluğa kayıtlı tüm üyelerin listesi</p>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar bg-[#f8f9fa]">
                    <div className="flex flex-col gap-4">
                        {members && members.length > 0 ? (
                            members.map((member, index) => (
                                <div key={index} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex flex-col relative hover:border-gray-300 transition">
                                    <span className="absolute top-5 right-5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                                        {getRoleName(member.role_id)}
                                    </span>
                                    <h3 className="text-gray-900 font-bold text-lg mb-2">{member.name}</h3>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p><span className="font-medium text-gray-700">Öğrenci No:</span> {member.studentNo || "Yok"}</p>
                                        <p><span className="font-medium text-gray-700">E-posta:</span> {member.email}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Üye bulunamadı.</p>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl flex justify-end">
                     <button 
                        onClick={onBack}
                        className="text-gray-500 hover:text-gray-900 text-sm font-semibold px-4 py-2 cursor-pointer"
                    >
                        &larr; Geri Dön
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 2. POPUP: DETAY VE YÖNETİM KURULU ---
const CommunityDetailsPopup = ({ community, members, onClose, onViewAllMembers }) => {
    if (!community) return null;

    console.log("🔎 CommunityDetailsPopup Açıldı. Gelen Üye Sayısı:", members?.length);

    // Sadece Yönetim Kurulu (Role ID < 10 olanlar yönetim kabul edilir genelde)
    const boardMembers = members ? members.filter(m => parseInt(m.role_id) < 10) : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative flex flex-col max-h-[90vh]">
                
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition cursor-pointer"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <div className="p-8 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{community.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">Topluluk üyeleri ve yönetim kurulu bilgileri</p>
                </div>

                <div className="px-8 overflow-y-auto custom-scrollbar">
                    <h3 className="text-gray-800 font-medium mb-3">Yönetim Kurulu</h3>
                    <div className="flex flex-col gap-3 mb-6">
                        {boardMembers.length > 0 ? (
                            boardMembers.map((member, index) => (
                                <div key={index} className="bg-[#f0f9ff] border border-blue-50 p-4 rounded-xl flex flex-col justify-center">
                                    <p className="text-gray-900 font-semibold text-sm">
                                        {member.name} - {getRoleName(member.role_id)}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-0.5 font-light">
                                        {member.email}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">Yönetim kurulu bilgisi bulunamadı.</p>
                        )}
                    </div>
                </div>

                <div className="p-8 pt-4 mt-auto border-t border-gray-100 flex flex-row items-center justify-between">
                    <p className="text-gray-500 text-sm">
                        Toplam <span className="font-semibold text-gray-700">{community.members} üye</span> bulunmaktadır.
                    </p>
                    
                    <button 
                        onClick={onViewAllMembers}
                        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faUsers} />
                        Tüm Üyeleri Görüntüle
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 3. ANA BİLEŞEN ---
const CommunityBoxes = () => {
    const [vocationalCommunities, setVocationalCommunities] = useState([]);
    const [socialCommunities, setSocialCommunities] = useState([]);
    
    const [selectedCommunity, setSelectedCommunity] = useState(null); // Detay Popup için
    const [viewMembersCommunity, setViewMembersCommunity] = useState(null); // Liste Popup için
    const [communityMembers, setCommunityMembers] = useState([]); // Seçili topluluğun üyeleri

    // 1. Topluluk Listesini Çek
    useEffect(() => {
        console.log("🚀 [CommunityBoxes] Topluluk listesi çekiliyor...");
        
        fetch("http://localhost/student-automation-server/get_communities_list.php")
            .then(res => {
                console.log("📡 List Response Status:", res.status);
                return res.text(); // Text olarak alıp kontrol edelim
            })
            .then(text => {
                console.log("📄 List Raw Response:", text);
                try {
                    const data = JSON.parse(text);
                    console.log("✅ Parsed List Data:", data);
                    
                    if (data.success) {
                        setVocationalCommunities(data.data.vocational);
                        setSocialCommunities(data.data.social);
                        console.log("📊 State güncellendi: Vocational:", data.data.vocational.length, "Social:", data.data.social.length);
                    } else {
                        console.error("❌ API Success False:", data.message);
                    }
                } catch (e) {
                    console.error("❌ JSON Parse Hatası (Liste):", e);
                }
            })
            .catch(err => console.error("🔴 Liste Fetch Hatası:", err));
    }, []);

    // 2. Bir topluluğa tıklandığında üyelerini çek
    const handleOpenDetails = (community) => {
        console.log("👁️ [handleOpenDetails] Tıklandı:", community);
        
        // Önce seçili topluluğu ayarla
        setSelectedCommunity(community);
        setCommunityMembers([]); // Önceki datayı temizle

        const url = `http://localhost/student-automation-server/get_community_members.php?community_id=${community.id}`;
        console.log("🔗 Üyeler çekiliyor:", url);

        // Üyeleri API'den çek
        fetch(url)
            .then(res => res.text()) // Text olarak al
            .then(text => {
                console.log("📄 Members Raw Response:", text);
                try {
                    const data = JSON.parse(text);
                    console.log("✅ Members Data:", data);
                    if (data.success) {
                        setCommunityMembers(data.data);
                        console.log("👥 Üyeler state'e atandı. Sayı:", data.data.length);
                    } else {
                        console.error("❌ Members API Error:", data.message);
                    }
                } catch (e) {
                    console.error("❌ JSON Parse Hatası (Members):", e);
                }
            })
            .catch(err => console.error("🔴 Üye Çekme Hatası:", err));
    };

    const handleOpenMembersList = () => {
        console.log("🔄 Tüm üyeler listesine geçiş yapılıyor...");
        setViewMembersCommunity(selectedCommunity);
        setSelectedCommunity(null);
    };

    const handleBackToDetails = () => {
        console.log("⬅️ Detaylara geri dönülüyor...");
        setSelectedCommunity(viewMembersCommunity);
        setViewMembersCommunity(null);
    };

    return (
        <>
            {/* Detay Popup */}
            {selectedCommunity && (
                <CommunityDetailsPopup 
                    community={selectedCommunity} 
                    members={communityMembers}
                    onClose={() => setSelectedCommunity(null)} 
                    onViewAllMembers={handleOpenMembersList}
                />
            )}

            {/* Tüm Üyeler Popup */}
            {viewMembersCommunity && (
                <AllMembersPopup
                    community={viewMembersCommunity}
                    members={communityMembers}
                    onClose={() => setViewMembersCommunity(null)}
                    onBack={handleBackToDetails}
                />
            )}

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                
                {/* SOL KUTU: Mesleki Topluluklar */}
                <div className="bg-white border border-black/10 rounded-xl shadow-sm p-6 flex flex-col h-125">
                    <div className="mb-4">
                        <h2 className="text-gray-900 font-semibold text-lg">Mesleki Topluluklar</h2>
                        <p className="text-gray-500 text-sm">Toplam {vocationalCommunities.length} topluluk</p>
                    </div>

                    <div className="overflow-y-auto pr-2 space-y-3 flex-1 custom-scrollbar">
                        {vocationalCommunities.length > 0 ? (
                            vocationalCommunities.map((community) => (
                                <div key={community.id} className="bg-[#F9FAFB] border border-gray-100 p-4 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-bold text-gray-900 text-sm">{community.name}</h3>
                                        <p className="text-gray-500 text-xs font-medium">
                                            {community.members} üye • {community.events} etkinlik
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleOpenDetails(community)}
                                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition shadow-sm cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center mt-10">Kayıtlı mesleki topluluk yok.</p>
                        )}
                    </div>
                </div>

                {/* SAĞ KUTU: Sosyal Topluluklar */}
                <div className="bg-white border border-black/10 rounded-xl shadow-sm p-6 flex flex-col h-125">
                    <div className="mb-4">
                        <h2 className="text-gray-900 font-semibold text-lg">Sosyal Topluluklar</h2>
                        <p className="text-gray-500 text-sm">Toplam {socialCommunities.length} topluluk</p>
                    </div>

                    <div className="overflow-y-auto pr-2 space-y-3 flex-1 custom-scrollbar">
                        {socialCommunities.length > 0 ? (
                            socialCommunities.map((community) => (
                                <div key={community.id} className="bg-[#F9FAFB] border border-gray-100 p-4 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-bold text-gray-900 text-sm">{community.name}</h3>
                                        <p className="text-gray-500 text-xs font-medium">
                                            {community.members} üye • {community.events} etkinlik
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleOpenDetails(community)}
                                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition shadow-sm cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faEye} className="cursor-pointer" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center mt-10">Kayıtlı sosyal topluluk yok.</p>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}

export default CommunityBoxes;