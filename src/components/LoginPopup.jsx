import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers, faShield, faGraduationCap, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const accountTypes = [
    { id: "student", label: "Öğrenci", icon: faUser },
    { id: "management", label: "Yönetim", icon: faUsers },
    { id: "consultant", label: "Danışman", icon: faGraduationCap },
    { id: "admin", label: "İdare", icon: faShield },
];

const LoginPopup = ({ onClose, setUser }) => {
    const [active, setActive] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Değişiklik 1: 'e' parametresi eklendi ve preventDefault yapıldı
    const handleLogin = async (e) => {
        if (e) e.preventDefault(); // Form submit olduğunda sayfa yenilenmesin diye
        
        setError("");

        if (!email || !password) {
            setError("Lütfen e-posta ve şifrenizi girin.");
            return;
        }

        try {
            const res = await fetch("http://localhost/student-automation-server/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: active, email, password })
            });
            const data = await res.json();
            
            if (data.success) {
                const userRole = data.user.role || active; 
                
                const loggedInUser = { 
                    isLoggedIn: true, 
                    role: userRole, 
                    email: data.user.email,
                    ...data.user
                };

                localStorage.setItem('user', JSON.stringify(loggedInUser));

                setUser(loggedInUser); 
                onClose();
            } else {
                setError(data.message || "Giriş başarısız.");
            }
        } catch (e) {
            console.log("Login Hatası:", e);
            setError("Sunucuya ulaşılamadı veya geçersiz yanıt alındı.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white text-black gap-4 w-140 h-auto rounded-xl shadow-xl px-6 py-8 relative flex flex-col">
                <h1 className="text-xl font-semibold">Topluluk Sistemine Giriş</h1>
                <p className="text-sm text-black/60">Hesap türünüzü seçin ve bilgilerinizi girin.</p>

                <div className="flex flex-row bg-[#ECECF0] w-full h-10 rounded-xl items-center justify-center px-2 gap-4">
                    {accountTypes.map((type) => (
                        <div
                            key={type.id}
                            onClick={() => {
                                setActive(type.id);
                                setError(""); 
                                setEmail(""); 
                                setPassword(""); 
                            }}
                            className={`flex flex-row items-center px-4 py-1 rounded-xl gap-2 cursor-pointer transition ${active === type.id ? "bg-white text-black font-semibold" : "bg-[#ECECF0] text-black/60"}`}
                        >
                            <FontAwesomeIcon icon={type.icon} className={`text-sm ${active === type.id ? "text-black" : "text-black/40"}`} />
                            <h1 className="text-sm">{type.label}</h1>
                        </div>
                    ))}
                </div>

                <div className="w-full mt-4 flex-1">
                    {active === "student" && (
                        <div className="w-full h-full">
                            <div className="flex flex-col gap-4 border-2 border-[#d1e3fa] bg-[#EFF6FF] px-4 py-6 rounded-xl shadow-xl">
                                <div className="flex flex-row gap-2 items-center">
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-black/80" />
                                    <p className="text-sm text-black/60">Öğrenci e-posta formatı:</p>
                                </div>
                                <p className="font-bold text-sm text-black/70 ml-7">ogrencino@std.idu.edu.tr</p>
                                <p className="text-sm mt-4 ml-7 text-black/60">İlk Şifre: Öğrenci No + IDU@ (Değiştirilebilir)</p>
                            </div>
                            {/* Değişiklik 2: div yerine form kullanıldı ve onSubmit eklendi */}
                            <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-black text-sm">Okul E-Posta Adresi</span>
                                    <input type="text" placeholder="ogrencino@std.idu.edu.tr" className="text-sm px-4 py-2 rounded-xl bg-[#F3F3F5]" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-black text-sm">Şifre</span>
                                    <input type="password" placeholder="Öğrenci No + IDU@" className="text-sm px-4 py-2 rounded-xl bg-[#F3F3F5]" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                {/* Değişiklik 3: type='submit' eklendi */}
                                <button type="submit" className="cursor-pointer bg-[#062639] rounded-xl w-full text-white font-semibold py-2">Öğrenci Olarak Giriş Yap</button>
                            </form>
                        </div>
                    )}

                    {active === "management" && (
                        <div className="w-full h-full">
                            <div className="flex flex-col gap-4 border-2 border-[#d1e3fa] bg-[#EFF6FF] px-4 py-4 rounded-xl shadow-xl">
                                <div className="flex flex-row gap-2 items-center">
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-black/80" />
                                    <p className="text-sm text-black/60">Yönetim kurulu üyeleri öğrenci e-posta ve şifre bilgilerini kullanır.</p>
                                </div>
                            </div>
                            {/* Değişiklik: Form yapısına çevrildi */}
                            <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-black text-sm">Okul E-Posta Adresi</span>
                                    <input type="text" placeholder="ogrencino@std.idu.edu.tr" className="text-sm px-4 py-2 rounded-xl bg-[#F3F3F5]" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-black text-sm">Şifre</span>
                                    <input type="password" placeholder="Öğrenci No + IDU@" className="text-sm px-4 py-2 rounded-xl bg-[#F3F3F5]" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button type="submit" className="cursor-pointer bg-[#062639] rounded-xl w-full text-white font-semibold py-2">Yönetim Olarak Giriş Yap</button>
                            </form>
                        </div>
                    )}

                    {active === "consultant" && (
                        <div className="w-full h-full">
                            <div className="flex flex-col gap-4 border-2 border-[#EFE0FF] bg-[#F4EBFF] px-4 py-4 rounded-xl shadow-xl">
                                <div className="flex flex-row gap-2 items-center">
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-black/80" />
                                    <p className="text-sm text-black/60">Akademik danışman girişi için e-posta ve şifrenizi kullanın.</p>
                                </div>
                            </div>
                            {/* Değişiklik: Form yapısına çevrildi */}
                            <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-black text-sm">Danışman E-posta</span>
                                    <input type="text" placeholder="mail@idu.edu.tr" className="text-sm px-4 py-2 rounded-xl bg-[#F3F3F5]" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-black text-sm">Danışman Şifresi</span>
                                    <input type="password" placeholder="Ad + Soyad + IDU@" className="text-sm px-4 py-2 rounded-xl bg-[#F3F3F5]" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button type="submit" className="cursor-pointer bg-[#062639] rounded-xl w-full text-white font-semibold py-2">Danışman Olarak Giriş Yap</button>
                            </form>
                        </div>
                    )}

                    {active === "admin" && (
                        <div className="w-full h-full">
                            <div className="flex flex-col gap-4 border-2 border-[#FEF3CB] bg-[#FFFBEB] px-4 py-4 rounded-xl shadow-xl">
                                <div className="flex flex-row gap-2 items-center">
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-black/80" />
                                    <p className="text-sm text-black/60">Yönetici girişi için yetkili e-posta ve şifrenizi kullanın.</p>
                                </div>
                            </div>
                            {/* Değişiklik: Form yapısına çevrildi */}
                            <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-black text-sm">Yönetici E-posta</span>
                                    <input type="text" placeholder="idare@idu.edu.tr" className="text-sm px-4 py-2 rounded-xl bg-[#F3F3F5]" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-black text-sm">Yönetici Şifresi</span>
                                    <input type="password" placeholder="Ad + Soyad + IDU@" className="text-sm px-4 py-2 rounded-xl bg-[#F3F3F5]" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button type="submit" className="cursor-pointer bg-[#062639] rounded-xl w-full text-white font-semibold py-2">İdare Olarak Giriş Yap</button>
                            </form>
                        </div>
                    )}
                </div>

                <button onClick={onClose} className="absolute top-4 right-6 text-black font-bold cursor-pointer text-2xl">✕</button>
            </div>
        </div>
    );
};

export default LoginPopup;