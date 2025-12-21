import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSave, faBuilding, faUserTie, faInfoCircle, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const CommunityInfoPopup = ({ isVisible, onClose }) => {
    const [info, setInfo] = useState({
        community_id: '',
        community_name: '',
        advisor_name: '',
        created_at: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    // Popup açılınca veriyi çek
    useEffect(() => {
        if (isVisible) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const userId = user.user_id || user.id;
                fetchData(userId);
            }
        }
    }, [isVisible]);

    const fetchData = (userId) => {
        setLoading(true);
        fetch(`http://localhost/student-automation-server/get_managed_community.php?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setInfo(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleSave = () => {
        fetch("http://localhost/student-automation-server/update_community_info.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                community_id: info.community_id,
                description: info.description
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Topluluk bilgileri güncellendi!");
                onClose();
            } else {
                alert("Hata: " + data.message);
            }
        })
        .catch(err => console.error(err));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 relative animate-fade-in flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-[#062639]">Topluluk Bilgileri</h2>
                        <p className="text-sm text-gray-500">Topluluğunuzun genel bilgilerini görüntüleyin ve düzenleyin.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 cursor-pointer">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[75vh]">
                    {loading ? (
                        <p className="text-center py-4">Yükleniyor...</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            
                            {/* Read-Only Alanlar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                                        <FontAwesomeIcon icon={faBuilding} className="mr-2"/> Topluluk Adı
                                    </label>
                                    <input 
                                        type="text" 
                                        value={info.community_name} 
                                        readOnly 
                                        className="w-full bg-gray-100 border border-gray-300 text-gray-600 rounded-lg px-4 py-2 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                                        <FontAwesomeIcon icon={faUserTie} className="mr-2"/> Akademik Danışman
                                    </label>
                                    <input 
                                        type="text" 
                                        value={info.advisor_name || 'Atanmamış'} 
                                        readOnly 
                                        className="w-full bg-gray-100 border border-gray-300 text-gray-600 rounded-lg px-4 py-2 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2"/> Kuruluş Tarihi
                                    </label>
                                    <input 
                                        type="text" 
                                        value={info.created_at} 
                                        readOnly 
                                        className="w-full bg-gray-100 border border-gray-300 text-gray-600 rounded-lg px-4 py-2 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Düzenlenebilir Alan */}
                            <div className='text-black'>
                                <label className="block text-sm font-semibold mb-2 text-[#062639]">
                                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2"/> Topluluk Açıklaması (Düzenlenebilir)
                                </label>
                                <textarea 
                                    rows="5"
                                    value={info.description}
                                    onChange={(e) => setInfo({...info, description: e.target.value})}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#062639] focus:ring-1 focus:ring-[#062639] transition-all"
                                    placeholder="Topluluğunuzu tanıtan bir açıklama giriniz..."
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-1">Bu açıklama öğrenciler toplulukları keşfederken görünecektir.</p>
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-xl">
                    <button 
                        onClick={handleSave} 
                        className="px-6 py-2 bg-[#062639] text-white rounded-lg hover:bg-[#08415a] transition cursor-pointer flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faSave} /> Değişiklikleri Kaydet
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CommunityInfoPopup;