import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleLine, faAngleDown, faUser, faCheck, faClock, faList } from "@fortawesome/free-solid-svg-icons";
import SocietyMembersPopup from "./SocietyMembersPopup"; // YENİ IMPORT

const SocietyListCard = ({ id, name, description, memberCount, president, advisor }) => {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("none"); 
    const [showMembersPopup, setShowMembersPopup] = useState(false); // Popup state

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                
                const userId = parsedUser.user_id || parsedUser.id;
                // Sadece öğrenciler ve adminler için katılım durumu kontrol edilir
                if ((parsedUser.role === 'student' || parsedUser.role === 'admin') && id && userId) {
                    fetch(`http://localhost/student-automation-server/get_community_status.php?user_id=${userId}&community_id=${id}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                setStatus(data.status);
                            }
                        })
                        .catch(err => console.error(err));
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, [id]);

    const handleJoin = () => {
        if (!user) return;
        const userId = user.user_id || user.id;

        fetch("http://localhost/student-automation-server/join_community.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, community_id: id })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setStatus("pending");
                alert(data.message);
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error(err));
    };

    // Buton gösterme koşulları
    const showJoinButton = user && (user.role === 'student' || user.role === 'admin');
    const showManagementView = user && (user.role === 'sks' || user.role === 'advisor');

    return (
        <>
            <div className=" bg-[#F3F4F6] rounded-lg border border-black/10 container">

                <div
                    className="h-12 flex items-center px-6 justify-between cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    <p className="font-semibold text-sm">{name}</p>

                    <div className="flex items-center">
                        <div className="flex flex-row bg-[#ccc] px-2 py-1 rounded-lg items-center">
                            <FontAwesomeIcon icon={faPeopleLine} className="text-black text-xs" />
                            <span className="ml-2 text-xs text-black">{memberCount} Üye</span>
                        </div>

                        <FontAwesomeIcon
                            icon={faAngleDown}
                            className={`text-black text-sm ml-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        />
                    </div>
                </div>

                <div className={`transition-all duration-300 overflow-hidden ${open ? "max-h-96 py-4 px-6" : "max-h-0 py-0 px-6"}`}>
                    <p className="text-black/50 text-sm">{description}</p>

                    <div className="flex flex-row items-center mt-4 mb-2">
                        <FontAwesomeIcon icon={faUser} className="text-black text-sm mr-2" />
                        <p className="text-sm">Topluluk Başkanı ve Akademik Danışmanı</p>
                    </div>

                    <div className="flex flex-row w-full h-16 gap-2">
                        <div className="flex flex-row border border-black/10 gap-4 rounded-lg bg-white w-full p-2 items-center">
                            <div className="bg-[#062639] rounded-full w-12 h-12 text-white flex items-center justify-center font-bold">
                                {president ? president.split(" ").map(w => w[0]).join("") : "?"}
                            </div>
                            <div>
                                <div className="text-sm">{president || "Belirlenmedi"}</div>
                                <p className="text-sm text-black/50">Başkan</p>
                            </div>
                        </div>

                        <div className="flex flex-row border border-black/10 gap-4 rounded-lg bg-white w-full p-2 items-center">
                            <div className="bg-[#062639] rounded-full w-12 h-12 text-white flex items-center justify-center font-bold">
                                {advisor ? advisor.split(" ").map(w => w[0]).join("") : "?"}
                            </div>
                            <div>
                                <div className="text-sm">{advisor || "Belirlenmedi"}</div>
                                <p className="text-sm text-black/50">Akademik Danışman</p>
                            </div>
                        </div>
                    </div>

                    {/* SKS veya Advisor ise Üyeler Butonu */}
                    {showManagementView && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center">
                            <span className="text-sm text-[#062639]">
                                Toplam <b>{memberCount}</b> üye bulunmaktadır.
                            </span>
                            <button 
                                onClick={() => setShowMembersPopup(true)}
                                className="bg-[#062639] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#08415a] transition cursor-pointer flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faList} /> Üyeler
                            </button>
                        </div>
                    )}

                    {/* Öğrenci ise Katıl Butonu */}
                    {showJoinButton && (
                        <div className="mt-4 flex justify-end">
                            {status === "none" && (
                                <button 
                                    onClick={handleJoin}
                                    className="bg-[#062639] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#08415a] transition cursor-pointer"
                                >
                                    Topluluğa Başvur
                                </button>
                            )}
                            {status === "pending" && (
                                <button disabled className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 cursor-not-allowed border border-yellow-200">
                                    <FontAwesomeIcon icon={faClock} /> Başvuru Bekliyor
                                </button>
                            )}
                            {status === "member" && (
                                <button disabled className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 cursor-not-allowed border border-green-200">
                                    <FontAwesomeIcon icon={faCheck} /> Üyesiniz
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ÜYE LİSTESİ POPUP */}
            <SocietyMembersPopup 
                isVisible={showMembersPopup} 
                onClose={() => setShowMembersPopup(false)}
                communityId={id}
                communityName={name}
            />
        </>
    );
};

export default SocietyListCard;