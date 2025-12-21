import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const images = import.meta.glob("/src/assets/society/*.{jpg,png}", { eager: true });

const imageList = Object.values(images).map((img) => img?.default || img);

const Slider = () => {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef(null);

    const resetTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % imageList.length);
        }, 15000);
    };

    const next = () => {
        setCurrent((prev) => (prev + 1) % imageList.length);
        resetTimer();
    };

    const prev = () => {
        setCurrent((prev) => (prev - 1 + imageList.length) % imageList.length);
        resetTimer();
    };

    const goTo = (index) => {
        setCurrent(index);
        resetTimer();
    };

    useEffect(() => {
        resetTimer();
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div className="w-full h-80 bg-[#F3F4F6] flex items-center justify-center relative">
            <div className="container h-64 rounded-2xl relative overflow-hidden">
                <img src={imageList[current]} alt={`slide-${current}`} className="w-full h-full rounded-2xl object-fit z-0 relative" />
                <div className="absolute inset-0 bg-black/30 rounded-2xl z-10"></div>
                <div className="absolute flex flex-col text-white bottom-4 left-10 z-20">
                    <h1 className="font-semibold text-3xl">Topluluklara Katıl</h1>
                    <h3 className="font-semibold text-lg"> Kampüs yaşamını keşfet ve yeni arkadaşlar edin. </h3>
                </div>
                <button onClick={prev} className="absolute top-1/2 -translate-y-1/2 left-4 text-white z-30 bg-white/30 p-2 rounded-full hover:bg-white/60 transition cursor-pointer" >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button onClick={next} className="absolute top-1/2 -translate-y-1/2 right-4 text-white z-30 bg-white/30 p-2 rounded-full hover:bg-white/60 transition cursor-pointer" >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    {imageList.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`w-3 h-3 rounded-full transition cursor-pointer ${i === current ? "bg-white w-8" : "bg-gray-400"}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Slider;