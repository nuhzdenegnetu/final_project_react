import {useState} from "react";
import {ModalProps} from "../../types/modal.interface.ts";
import {HeroForm} from "../../types/form.interface.ts";
import axios from "axios";
import {API_URL_HEROES} from "../../const/API_MOCKS";
import ReactDOM from "react-dom";

export default function AddHeroForm({showModal, setShowModal}: ModalProps) {
    const [form, setForm] = useState<HeroForm>({
        name: "",
        role: "",
        portrait: "",
        abilities: [
            { name: "", description: "" },
            { name: "", description: "" },
            { name: "", description: "" },
            { name: "", description: "" }
        ]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleAbilityChange = (index: number, field: 'name' | 'description', value: string) => {
        const updatedAbilities = [...form.abilities];
        updatedAbilities[index][field] = value;
        setForm({...form, abilities: updatedAbilities});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Проверяем обязательные поля
        if (!form.name.trim() || !form.role) {
            alert("Пожалуйста, заполните имя и роль героя");
            return;
        }
        
        // Проверяем, заполнена ли хотя бы одна способность полностью
        const hasValidAbility = form.abilities.some(
            ability => ability.name.trim() && ability.description.trim()
        );
        
        if (!hasValidAbility) {
            alert("Пожалуйста, заполните хотя бы одну способность");
            return;
        }
        
        // Фильтруем пустые способности
        const filteredAbilities = form.abilities.filter(
            ability => ability.name.trim() && ability.description.trim()
        );
        
        try {
            // Создаем объект героя, добавляя portrait только если он указан
            const heroData = {
                ...form,
                abilities: filteredAbilities,
                portrait: form.portrait?.trim() || "https://via.placeholder.com/150?text=Нет+изображения" // Используем placeholder по умолчанию
            };
            
            // Отправляем данные на сервер
            const response = await axios.post(API_URL_HEROES, heroData);
            console.log("Новый герой отправлен:", response.data);
            alert("Герой успешно добавлен!");
            setForm({
                name: "",
                role: "",
                portrait: "",
                abilities: [
                    { name: "", description: "" },
                    { name: "", description: "" },
                    { name: "", description: "" },
                    { name: "", description: "" }
                ]
            });
            setShowModal(false);
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Произошла ошибка. Пожалуйста, попробуйте снова.");
        }
    };

    // Обработчик клика вне модального окна
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    };

    if (!showModal) return null;

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 flex items-center justify-center z-[9999]" 
            style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)'}}
            onClick={handleOverlayClick}
        >
            <div className="bg-gray-900 border border-purple-800 p-5 rounded-xl shadow-2xl shadow-purple-500/20 w-full max-w-xl relative m-4">
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4 text-purple-300 border-b border-purple-800 pb-2">
                    Добавить нового героя
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-purple-300 mb-1">Имя героя</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Имя героя"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-purple-300 mb-1">Роль</label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                required
                            >
                                <option value="">Выберите роль</option>
                                <option value="Керри">Керри</option>
                                <option value="Поддержка">Поддержка</option>
                                <option value="Нюкер">Нюкер</option>
                                <option value="Дизейблер">Дизейблер</option>
                                <option value="Инициатор">Инициатор</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1">
                            URL портрета <span className="text-gray-500 text-xs">(необязательно)</span>
                        </label>
                        <input
                            type="url"
                            name="portrait"
                            placeholder="URL изображения героя"
                            value={form.portrait}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1">Способности</label>
                        
                        <div className="grid grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1">
                            {form.abilities.map((ability, index) => (
                                <div key={index} className="border border-gray-700 p-2 rounded-lg bg-gray-800">
                                    <p className="font-medium mb-2 text-purple-300 border-b border-gray-700 pb-1 flex items-center text-sm">
                                        <span className="inline-block w-5 h-5 bg-purple-700 rounded-full mr-2 ability-num text-xs">
                                            {index + 1}
                                        </span>
                                        Способность {index + 1}
                                    </p>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Название"
                                            value={ability.name}
                                            onChange={(e) => handleAbilityChange(index, 'name', e.target.value)}
                                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
                                            required
                                        />
                                        <textarea
                                            placeholder="Описание"
                                            value={ability.description}
                                            onChange={(e) => handleAbilityChange(index, 'description', e.target.value)}
                                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
                                            rows={1}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-lg w-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50 mt-2"
                    >
                        Добавить героя
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
} 