import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faMailBulk, faPen, faTrash, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

const MemberManagementPopup = ({ isVisible, onClose }) => {
    const [members, setMembers] = useState([]);
    const [roles, setRoles] = useState([]); 
    const [memberSearch, setMemberSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // --- MODAL STATE'LERİ ---
    const [editMember, setEditMember] = useState(null); // Düzenleme Modu
    const [showAddModal, setShowAddModal] = useState(false); // Ekleme Modu

    // --- FORM STATE'LERİ ---
    const [selectedRole, setSelectedRole] = useState(""); // Düzenleme için rol
    const [newMemberEmail, setNewMemberEmail] = useState(""); // Yeni üye E-posta
    const [newMemberRole, setNewMemberRole] = useState(10);   // Yeni üye Rol (Default 10)

    useEffect(() => {
        if (isVisible) {
            fetchMembers();
            fetchRoles();
        }
    }, [isVisible]);

    const fetchMembers = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedData = JSON.parse(storedUser);
                const userId = parsedData.user_id || parsedData.id;
                setLoading(true);
                
                fetch(`http://localhost/student-automation-server/get_community_members.php?user_id=${userId}`)
                    .then(res => res.json())
                    .then(response => {
                        if (response.success) {
                            setMembers(response.data);
                        } else {
                            console.error(response.message);
                            setMembers([]);
                        }
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error("Üye fetch hatası:", err);
                        setLoading(false);
                    });
            } catch (error) {
                console.error("JSON parse hatası:", error);
                setLoading(false);
            }
        }
    };

    const fetchRoles = () => {
        fetch("http://localhost/student-automation-server/get_roles.php")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setRoles(data.data);
                }
            })
            .catch(err => console.error("Roller çekilemedi:", err));
    };

    // --- YENİ ÜYE EKLEME ---
    const handleAddMember = () => {
        if (!newMemberEmail) {
            alert("Lütfen e-posta adresi girin.");
            return;
        }

        const storedUser = localStorage.getItem('user');
        const parsedData = JSON.parse(storedUser);
        const managerId = parsedData.user_id || parsedData.id;

        fetch("http://localhost/student-automation-server/add_member.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                manager_id: managerId,
                email: newMemberEmail,
                role_id: newMemberRole
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Üye başarıyla eklendi!");
                setShowAddModal(false);
                setNewMemberEmail("");
                setNewMemberRole(10);
                fetchMembers(); // Listeyi yenile
            } else {
                alert("Hata: " + data.message);
            }
        })
        .catch(err => console.error("Ekleme hatası:", err));
    };

    // --- ÜYE GÜNCELLEME ---
    const handleUpdateMember = () => {
        if (!editMember) return;

        fetch("http://localhost/student-automation-server/update_member.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: 'update',
                member_id: editMember.member_id,
                role_id: selectedRole
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Üye rolü güncellendi!");
                setEditMember(null);
                fetchMembers(); 
            } else {
                alert("Hata: " + data.message);
            }
        })
        .catch(err => console.error("Güncelleme hatası:", err));
    };

    // --- ÜYE SİLME ---
    const handleDeleteMember = (memberId) => {
        if (window.confirm("Bu üyeyi topluluktan çıkarmak istediğinize emin misiniz?")) {
            fetch("http://localhost/student-automation-server/update_member.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: 'delete',
                    member_id: memberId
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMembers(prevMembers => prevMembers.filter(m => m.member_id !== memberId));
                } else {
                    alert("Hata: " + data.message);
                }
            })
            .catch(err => console.error("Silme hatası:", err));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    const openEditModal = (member) => {
        setEditMember(member);
        setSelectedRole(member.role_id);
    };

    const filteredMembers = members.filter(member =>
        (member.full_name && member.full_name.toLowerCase().includes(memberSearch.toLowerCase())) ||
        (member.student_number && member.student_number.includes(memberSearch)) ||
        (member.email && member.email.toLowerCase().includes(memberSearch.toLowerCase()))
    );

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            
            {/* --- ANA POPUP (ÜYE LİSTESİ) --- */}
            <div className="bg-white p-6 rounded-xl shadow-lg w-240 relative animate-fade-in max-h-[90vh] flex flex-col">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 cursor-pointer z-10">
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <div className="flex flex-col h-full overflow-hidden">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-[#062639]">Üye Yönetimi</h2>
                        <p className="text-black/60 text-sm">Topluluk üyelerini görüntüleyin, düzenleyin veya kaldırın</p>
                    </div>
                    
                    <div className="relative w-full mb-4 text-black">
                        <input
                            type="text"
                            placeholder="Üye ara (isim, e-posta, öğrenci no)..."
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                            className="rounded-xl border border-gray-300 bg-white px-2 pl-10 py-3 flex items-center justify-start w-full focus:outline-none focus:border-[#062639]"
                        />
                        <FontAwesomeIcon icon={faSearch} className="absolute top-4 left-4 text-gray-400" />
                    </div>

                    <div className="flex-1 overflow-auto pr-2 gap-3 flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
                        {loading ? (
                            <p className="text-center text-gray-500">Yükleniyor...</p>
                        ) : filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <div key={member.member_id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-lg text-black">{member.full_name}</span>
                                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">{member.role_name}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-sm text-gray-500 mt-1">
                                            {member.email && <div className="flex items-center gap-2"><FontAwesomeIcon icon={faMailBulk} className="w-4" /><span>{member.email}</span></div>}
                                            <div className="flex items-center gap-2"><span className="font-medium">Öğrenci No:</span><span>{member.student_number}</span></div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400"><span>Katılım: {formatDate(member.joined_at)}</span></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 mt-3 sm:mt-0">
                                        <button onClick={() => openEditModal(member)} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#062639] transition-colors cursor-pointer"><FontAwesomeIcon icon={faPen} /></button>
                                        <button onClick={() => handleDeleteMember(member.member_id)} className="w-10 h-10 rounded-lg bg-[#dc3545] text-white flex items-center justify-center hover:bg-[#c82333] transition-colors cursor-pointer shadow-md"><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">Üye bulunamadı.</div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Toplam {filteredMembers.length} üye</span>
                        <button 
                            onClick={() => setShowAddModal(true)} 
                            className="bg-[#062639] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#08415a] transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Yeni Üye Ekle
                        </button>
                    </div>
                </div>
            </div>

            {/* --- DÜZENLEME MODALI --- */}
            {editMember && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-fade-in overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div><h3 className="text-lg font-bold text-[#062639]">Üye Düzenle</h3><p className="text-sm text-gray-500">Seçilen üyenin rolünü düzenleyin.</p></div>
                            <button onClick={() => setEditMember(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div><label className="block text-sm font-semibold text-gray-700 mb-1">İsim</label><input type="text" value={editMember.full_name} readOnly className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-600 cursor-not-allowed focus:outline-none" /></div>
                            <div><label className="block text-sm font-semibold text-gray-700 mb-1">E-posta</label><input type="text" value={editMember.email} readOnly className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-600 cursor-not-allowed focus:outline-none" /></div>
                            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Rol</label><select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#062639] focus:ring-1 focus:ring-[#062639]">{roles.map(role => (<option key={role.role_id} value={role.role_id}>{role.role_name}</option>))}</select></div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setEditMember(null)} className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">İptal</button>
                            <button onClick={handleUpdateMember} className="px-4 py-2 bg-[#062639] text-white rounded-lg hover:bg-[#08415a] cursor-pointer flex items-center gap-2"><FontAwesomeIcon icon={faSave} /> Kaydet</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- YENİ ÜYE EKLEME MODALI --- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-fade-in overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div><h3 className="text-lg font-bold text-[#062639]">Yeni Üye Ekle</h3><p className="text-sm text-gray-500">Topluluğa yeni üye ekleyin</p></div>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">E-posta</label>
                                <input 
                                    type="email" 
                                    value={newMemberEmail} 
                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                    placeholder="ornek@std.idu.edu.tr"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#062639] focus:ring-1 focus:ring-[#062639]" 
                                />
                                <p className="text-xs text-gray-500 mt-1">Kullanıcının sistemde kayıtlı olması gerekir.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Rol</label>
                                <select 
                                    value={newMemberRole} 
                                    onChange={(e) => setNewMemberRole(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#062639] focus:ring-1 focus:ring-[#062639]"
                                >
                                    {roles.map(role => (
                                        <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">İptal</button>
                            <button onClick={handleAddMember} className="px-4 py-2 bg-[#062639] text-white rounded-lg hover:bg-[#08415a] cursor-pointer">Ekle</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MemberManagementPopup;