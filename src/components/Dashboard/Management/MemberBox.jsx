import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser, faUsers, faTimes } from "@fortawesome/free-solid-svg-icons";

const Popup = ({ isVisible, onClose, data }) => {
    if (!isVisible || !data) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "Belirtilmemiş";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    const getRoleName = (roleId) => {
        const id = parseInt(roleId);
        if (id === 1) return 'Başkan';
        if (id === 2) return 'Başkan Yrd.';
        if (id === 3) return 'Sekreter';
        if (id === 10) return 'Üye'; 
        return 'Üye'; 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 relative animate-fade-in">
                
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <h2 className="text-xl font-bold text-[#062639]">
                    {data.community_name} - Detaylar
                </h2>
                <p className='text-black/40 mb-4'>Seçtiğiniz topluluk hakkında detaylı bilgiler.</p>

                <div className="p-4 rounded-lg h-auto flex items-start justify-start flex-col gap-4">
                    <div className='flex flex-row gap-4 items-center'>
                        <div className='bg-[#dbeafe] w-14 h-14 flex items-center justify-center rounded-lg'>
                            <FontAwesomeIcon icon={faUsers} className="text-[#062639]" />
                        </div>
                        <div className='text-black'>
                            <p className='text-black/50'>Topluluk Adı</p>
                            <h1 className='font-semibold text-xl'>{data.community_name}</h1>
                        </div>
                    </div>
                    <div className='flex flex-row gap-4 items-center'>
                        <div className='bg-[#dbeafe] w-14 h-14 flex items-center justify-center rounded-lg'>
                            <FontAwesomeIcon icon={faUser} className="text-[#062639]" />
                        </div>
                        <div className='text-black'>
                            <p className='text-black/50'>Rolüm</p>
                            <h1 className='font-semibold text-xl'>{getRoleName(data.role_id)}</h1>
                        </div>
                    </div>
                    <div className='flex flex-row gap-4 items-center'>
                        <div className='bg-[#dbeafe] w-14 h-14 flex items-center justify-center rounded-lg'>
                            <FontAwesomeIcon icon={faClock} className="text-[#062639]" />
                        </div>
                        <div className='text-black'>
                            <p className='text-black/50'>Katılım Tarihi</p>
                            <h1 className='font-semibold text-xl'>{formatDate(data.joined_at)}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MemberBox = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState(null);
    const [memberships, setMemberships] = useState([]);
    const [requests, setRequests] = useState([]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    const getRoleName = (roleId) => {
        const id = parseInt(roleId);
        if (id === 1) return 'Başkan';
        if (id === 2) return 'Başkan Yrd.';
        if (id === 10) return 'Üye';
        return 'Üye';
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.user_id || (parsedUser.user && parsedUser.user.user_id) || parsedUser.id;

                if (userId) {
                    fetch(`http://localhost/student-automation-server/get_member_communities.php?user_id=${userId}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                setMemberships(data.data.memberships);
                                setRequests(data.data.requests);
                            }
                        })
                        .catch(err => console.error(err));
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    const openPopup = (membership) => {
        setSelectedMembership(membership);
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
        setSelectedMembership(null);
    };

    return (
        <>
            <div className="py-2 w-full flex flex-row gap-4 items-start">
                <div className="w-2/4 border-black/10 border bg-white rounded-xl shadow-md p-6 flex flex-col min-h-[180px] h-auto max-h-96 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <p className="text-black/80 font-semibold mb-2">Üye olduğum Topluluklar</p>
                    
                    {memberships.length > 0 ? (
                        memberships.map((membership, index) => (
                            <div key={index} className="bg-[#f9fafb] mt-2 shadow-sm border border-gray-100 w-full rounded-2xl flex flex-row items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
                                <div className="flex flex-col gap-1 px-2">
                                    <p className="text-black font-medium">{membership.community_name}</p>
                                    <p className="text-black/50 text-sm">
                                        {getRoleName(membership.role_id)} | Katılım: {formatDate(membership.joined_at)}
                                    </p>
                                </div>
                                <div>
                                    <button 
                                        className="border border-black/10 text-black text-sm font-semibold flex items-center justify-center rounded-xl px-4 py-2 bg-white cursor-pointer hover:bg-gray-200 transition"
                                        onClick={() => openPopup(membership)}
                                    >
                                        Detaylar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 h-full py-4 opacity-50">
                            <FontAwesomeIcon icon={faUsers} size="2x" className="mb-2" />
                            <p className="text-sm">Henüz bir topluluğa üye değilsiniz.</p>
                        </div>
                    )}
                </div>

                <div className="w-2/4 border-black/10 border bg-white rounded-xl shadow-md p-6 flex flex-col min-h-[180px] h-auto max-h-96 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <p className="text-black/80 font-semibold mb-2">Başvurularım</p>
                    
                    {requests.length > 0 ? (
                        requests.map((req, index) => (
                            <div key={index} className="bg-[#f9fafb] mt-2 shadow-sm border border-gray-100 w-full rounded-2xl flex flex-row items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
                                <div className="flex flex-col gap-1 px-2">
                                    <p className="text-black font-medium">{req.community_name}</p>
                                    <p className="text-black/50 text-sm">{formatDate(req.request_date)}</p>
                                </div>
                                <div>
                                    <button 
                                        className="flex flex-row gap-2 border border-yellow-200 text-[#8f540a] text-sm font-semibold items-center justify-center rounded-xl px-3 py-1.5 bg-[#fef9c2] cursor-default"
                                    >
                                        <FontAwesomeIcon icon={faClock} /> <p>Bekliyor</p>
                                    </button>                    
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 h-full py-4 opacity-50">
                            <FontAwesomeIcon icon={faClock} size="2x" className="mb-2" />
                            <p className="text-sm">Bekleyen başvurunuz yok.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <Popup 
                isVisible={isPopupVisible} 
                onClose={closePopup} 
                data={selectedMembership} 
            />
        </>
    )
}

export default MemberBox;