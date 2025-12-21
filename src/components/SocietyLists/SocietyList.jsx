import { useState, useEffect } from "react";
import SocietyListCard from "./SocietyListCard";

export const SocietyList = () => {
    const [activeTab, setActiveTab] = useState("mesleki");
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        fetch("http://localhost/student-automation-server/communities.php")
            .then(res => res.json())
            .then(data => {
                console.log("API DATA:", data);
                setCommunities(data);
            })
            .catch(err => console.log("API ERROR:", err));
    }, []);

    const filtered = communities.filter(c => {
        const match = activeTab === "mesleki"
            ? c.type_name === "Mesleki Topluluklar"
            : c.type_name === "Sosyal Topluluklar";

        console.log("FILTER CHECK:", { name: c.community_name, type_name: c.type_name, activeTab, match });

        return match;
    });

    return (
        <div className="bg-[#F3F4F6] w-full h-200 text-black flex justify-center items-center">
            <div className="container w-full h-full">

                <h1 className="text-3xl font-semibold py-8">Topluluklar</h1>

                {/* TABLAR */}
                <div className="flex flex-row gap-4">
                    <button
                        onClick={() => setActiveTab("mesleki")}
                        className={`rounded-lg cursor-pointer px-4 py-2 font-semibold border
                        ${activeTab === "mesleki"
                                ? "bg-[#062639] text-white"
                                : "bg-white text-[#062639]"}`}
                    >
                        Mesleki Topluluklar
                    </button>

                    <button
                        onClick={() => setActiveTab("sosyal")}
                        className={`rounded-lg cursor-pointer px-4 py-2 font-semibold border
                        ${activeTab === "sosyal"
                                ? "bg-[#062639] text-white"
                                : "bg-white text-[#062639]"}`}
                    >
                        Sosyal Topluluklar
                    </button>
                </div>

                <div className="w-full bg-white container rounded-xl shadow-xl mt-4 flex flex-col gap-4 p-4 overflow-y-scroll 
                [&::-webkit-scrollbar]:w-1.5
                            [&::-webkit-scrollbar-track]:bg-transparent
                          [&::-webkit-scrollbar-thumb]:bg-gray-300
                            [&::-webkit-scrollbar-thumb]:rounded-full
                          [&::-webkit-scrollbar-thumb]:hover:bg-gray-400" style={{ maxHeight: '600px' }}>

                    <p className="text-black/60 mt-4 mx-8">
                        Toplam {filtered.length} topluluk bulunmaktadır.
                    </p>

                    <div className="container w-full flex flex-col gap-4 justify-start items-center mt-4">

                        {filtered.map(item => (
                            <SocietyListCard
                                key={item.community_id}
                                id={item.community_id}
                                name={item.community_name}
                                description={item.description}
                                memberCount={item.member_count ?? 0}
                                president={item.president_name}
                                advisor={item.advisor_name}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
