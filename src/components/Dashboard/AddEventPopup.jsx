import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUpload, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const AddEventPopup = ({ isVisible, onClose }) => {
    const posterInputRef = useRef(null);
    const docInputRef = useRef(null);
    const cvInputRef = useRef(null);
    const materialInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        event_type: '',
        event_date: '',
        event_time: '',
        location: '',
        description: '',
        materials_needed: '',
        has_speaker: false,
        speaker_info: '',
        has_stand: false,
        stand_details: '',
        stand_location: '',
        has_poster: false,
        poster_details: '',
        poster_file_name: '',
        doc_file_name: '',
        cv_file_name: '',
        material_file_name: ''
    });

    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({
        full_name: '',
        student_number: '',
        department: '',
        travel_info: '',
        per_diem: '',
        accommodation: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'radio' && value === 'yes' ? true : (type === 'radio' && value === 'no' ? false : value)
        }));
    };

    const handleRadioChange = (name, val) => {
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleStudentChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, fieldName) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                [fieldName]: e.target.files[0].name
            }));
        }
    };

    const triggerFileSelect = (ref) => {
        ref.current.click();
    };

    const addStudent = () => {
        if (newStudent.full_name && newStudent.student_number) {
            setStudents([...students, newStudent]);
            setNewStudent({
                full_name: '',
                student_number: '',
                department: '',
                travel_info: '',
                per_diem: '',
                accommodation: ''
            });
        } else {
            alert("Lütfen öğrenci adını ve numarasını giriniz.");
        }
    };

    const removeStudent = (index) => {
        const updated = [...students];
        updated.splice(index, 1);
        setStudents(updated);
    };

    const handleSubmit = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        const userId = user.user_id || user.id;

        const payload = {
            user_id: userId,
            ...formData,
            students: students
        };

        fetch("http://localhost/student-automation-server/create_application.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Başvuru başarıyla gönderildi!");
                onClose();
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error(err));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-10 text-black">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 relative animate-fade-in flex flex-col my-auto max-h-[90vh]">
                
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-xl sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-[#062639]">Yeni Etkinlik Ekle</h2>
                        <p className="text-sm text-gray-500">Etkinlik onay için yönetime gönderilecektir.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 cursor-pointer">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    
                    <div className="mb-8 border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Temel Bilgiler</h3>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Etkinlik Başlığı *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Örn: Bahar Şenliği 2025" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Etkinlik Türü *</label>
                                <select name="event_type" value={formData.event_type} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none">
                                    <option value="">Seçiniz</option>
                                    <option value="seminar">Konferans</option>
                                    <option value="panel">Panel</option>
                                    <option value="education">Eğitim</option>
                                    <option value="theater">Tiyatro</option>
                                    <option value="stand">Stant Çalışması</option>
                                    <option value="symposium">Sempozyum</option>
                                    <option value="exhibition">Sergi</option>
                                    <option value="festival">Festival / Şenlik</option>
                                    <option value="competition">Yarışma</option>
                                    <option value="concert">Konser</option>
                                    <option value="show">Gösteri / Film Gösterimi</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Tarih *</label>
                                <input type="date" name="event_date" value={formData.event_date} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Saat *</label>
                                <input type="time" name="event_time" value={formData.event_time} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">Konum *</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Örn: Amfi Tiyatro" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Açıklama</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Etkinlik hakkında detaylı bilgi..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"></textarea>
                        </div>
                    </div>

                    <div className="mb-8 border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Etkinlik Afişi ve Belgeler</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">Etkinlik Afişi</label>
                            <input type="file" ref={posterInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'poster_file_name')} />
                            <div className="flex items-center gap-3">
                                <button onClick={() => triggerFileSelect(posterInputRef)} className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                                    <FontAwesomeIcon icon={faUpload} /> Afiş Yükle
                                </button>
                                {formData.poster_file_name && <span className="text-sm text-green-600 truncate max-w-xs">{formData.poster_file_name}</span>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Ek Belgeler</label>
                            <input type="file" ref={docInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'doc_file_name')} />
                            <div className="flex items-center gap-3">
                                <button onClick={() => triggerFileSelect(docInputRef)} className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                                    <FontAwesomeIcon icon={faUpload} /> Belge Ekle
                                </button>
                                {formData.doc_file_name && <span className="text-sm text-green-600 truncate max-w-xs">{formData.doc_file_name}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Konuşmacı/Katılımcı Bilgileri</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Etkinlikte konuşmacı/katılımcı var mı? *</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="speaker_radio" checked={formData.has_speaker === true} onChange={() => handleRadioChange('has_speaker', true)} /> Evet
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="speaker_radio" checked={formData.has_speaker === false} onChange={() => handleRadioChange('has_speaker', false)} /> Hayır
                                </label>
                            </div>
                        </div>
                        {formData.has_speaker && (
                            <div>
                                <label className="block text-sm font-semibold mb-1">Konuşmacı Bilgileri</label>
                                <input type="text" name="speaker_info" value={formData.speaker_info} onChange={handleInputChange} placeholder="Ad Soyad, Ünvan, Kurum..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-2" />
                                <input type="file" ref={cvInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'cv_file_name')} />
                                <div className="flex items-center gap-3">
                                    <button onClick={() => triggerFileSelect(cvInputRef)} className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                                        <FontAwesomeIcon icon={faUpload} /> Özgeçmiş Ekle
                                    </button>
                                    {formData.cv_file_name && <span className="text-sm text-green-600 truncate max-w-xs">{formData.cv_file_name}</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-8 border border-gray-200 rounded-xl p-6 bg-blue-50">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faUserPlus} /> Etkinliğe Katılacak Öğrenciler
                        </h3>
                        
                        {students.length > 0 && (
                            <div className="mb-6 space-y-3">
                                {students.map((student, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg border border-blue-100 relative shadow-sm">
                                        <button onClick={() => removeStudent(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer">
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                        <div className="font-semibold text-blue-900">#{index + 1} {student.full_name}</div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {student.student_number} | {student.department}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Yolluk: {student.travel_info} | Konuklama: {student.accommodation}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input type="text" name="full_name" value={newStudent.full_name} onChange={handleStudentChange} placeholder="Ad Soyad" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2" />
                            <input type="text" name="student_number" value={newStudent.student_number} onChange={handleStudentChange} placeholder="Öğrenci Numarası" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2" />
                        </div>
                        <input type="text" name="department" value={newStudent.department} onChange={handleStudentChange} placeholder="Fakülte/Bölüm" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4" />
                        <input type="text" name="travel_info" value={newStudent.travel_info} onChange={handleStudentChange} placeholder="Yolluk (Örn: İzmir-Ankara, Gidiş: 15.11.2025)" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4" />
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input type="text" name="per_diem" value={newStudent.per_diem} onChange={handleStudentChange} placeholder="Yevmiye" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2" />
                            <input type="text" name="accommodation" value={newStudent.accommodation} onChange={handleStudentChange} placeholder="Konuklama" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2" />
                        </div>
                        <button onClick={addStudent} className="w-full bg-[#062639] text-white py-2 rounded-lg hover:bg-[#08415a] transition cursor-pointer">
                            + Öğrenci Ekle
                        </button>
                    </div>

                    <div className="mb-8 border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Stant Açma Talebi</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Stant açma talebi var mı? *</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="stand_radio" checked={formData.has_stand === true} onChange={() => handleRadioChange('has_stand', true)} /> Evet
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="stand_radio" checked={formData.has_stand === false} onChange={() => handleRadioChange('has_stand', false)} /> Hayır
                                </label>
                            </div>
                        </div>
                        {formData.has_stand && (
                            <div className="space-y-4">
                                <input type="text" name="stand_details" value={formData.stand_details} onChange={handleInputChange} placeholder="Stant İçeriği" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
                                <input type="text" name="stand_location" value={formData.stand_location} onChange={handleInputChange} placeholder="Stant Yeri ve Tarihi" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
                            </div>
                        )}
                    </div>

                    <div className="mb-8 border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Afiş/Flama Asma Talebi</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Afiş, flama vb. asma talebi var mı? *</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="poster_radio" checked={formData.has_poster === true} onChange={() => handleRadioChange('has_poster', true)} /> Evet
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="poster_radio" checked={formData.has_poster === false} onChange={() => handleRadioChange('has_poster', false)} /> Hayır
                                </label>
                            </div>
                        </div>
                        {formData.has_poster && (
                            <div className="space-y-4">
                                <input type="text" name="poster_details" value={formData.poster_details} onChange={handleInputChange} placeholder="Yer ve Tarih" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
                                <input type="file" ref={materialInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'material_file_name')} />
                                <div className="flex items-center gap-3">
                                    <button onClick={() => triggerFileSelect(materialInputRef)} className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                                        <FontAwesomeIcon icon={faUpload} /> Materyal Ekle
                                    </button>
                                    {formData.material_file_name && <span className="text-sm text-green-600 truncate max-w-xs">{formData.material_file_name}</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-8 border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Diğer Bilgiler ve Talepler</h3>
                        <textarea name="materials_needed" value={formData.materials_needed} onChange={handleInputChange} rows="3" placeholder="Etkinlik için ihtiyaç duyulan ekipman, teknik destek, izinler..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"></textarea>
                    </div>

                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-4 bg-gray-50 rounded-b-xl sticky bottom-0 z-10">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-100 cursor-pointer">İptal</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-[#062639] text-white rounded-lg hover:bg-[#08415a] cursor-pointer">Akademik Danışmana Gönder</button>
                </div>
            </div>
        </div>
    );
};

export default AddEventPopup;