import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";

const SocietyMembersPopup = ({ isVisible, onClose, communityId, communityName }) => {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isVisible && communityId) {
            setLoading(true);
            fetch(`http://localhost/student-automation-server/get_all_community_members.php?community_id=${communityId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setMembers(data.data);
                    } else {
                        console.error(data.message);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isVisible, communityId]);

    const getInitials = (name) => {
        if (!name) return "UK";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const filteredMembers = members.filter(m => 
        m.full_name.toLowerCase().includes(search.toLowerCase()) || 
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.student_number.includes(search)
    );

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
            <div className="bg-white p-6 rounded-xl shadow-lg w-240 max-w-4xl relative animate-fade-in max-h-[90vh] flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer">
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <div className="mb-4 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-[#062639]">{communityName} - Üye Listesi</h2>
                    <p className="text-gray-500 text-sm mt-1">Toplam {members.length} üye bulunmaktadır.</p>
                </div>

                <div className="relative mb-4">
                    <input 
                        type="text" 
                        placeholder="Üye ara..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-[#062639]"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 gap-3 flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {loading ? (
                        <p className="text-center py-8 text-gray-500">Yükleniyor...</p>
                    ) : filteredMembers.length > 0 ? (
                        filteredMembers.map((member, index) => (
                            <div key={member.member_id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                                <div className="w-12 h-12 bg-[#062639] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    {getInitials(member.full_name)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-[#062639]">{member.full_name}</span>
                                    <span className="text-sm text-gray-500">{member.student_number || 'Numara Yok'}</span>
                                    <span className="text-xs text-gray-400">{member.email}</span>
                                </div>
                                <div className="ml-auto text-sm text-gray-500">
                                    {member.role_name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-8 text-gray-500">Üye bulunamadı.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocietyMembersPopup;