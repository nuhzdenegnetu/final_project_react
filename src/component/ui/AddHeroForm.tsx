import {useState} from "react";
import {ModalProps} from "../../types/modal.interface.ts";
import {HeroForm} from "../../types/form.interface.ts";
import axios from "axios";
import {API_URL_HEROES} from "../../const/API_MOCKS";

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

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                >✖
                </button>
                <h2 className="text-xl font-semibold mb-4">Добавить нового героя</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Имя героя</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Имя героя"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
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
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL портрета <span className="text-gray-500 text-xs">(необязательно)</span>
                        </label>
                        <input
                            type="url"
                            name="portrait"
                            placeholder="URL изображения героя"
                            value={form.portrait}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Оставьте поле пустым, если изображение не требуется</p>
                    </div>
                    
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Способности</label>
                        
                        {form.abilities.map((ability, index) => (
                            <div key={index} className="border p-3 rounded-lg bg-gray-50">
                                <p className="font-medium mb-2">Способность {index + 1}</p>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Название способности"
                                        value={ability.name}
                                        onChange={(e) => handleAbilityChange(index, 'name', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <textarea
                                        placeholder="Описание способности"
                                        value={ability.description}
                                        onChange={(e) => handleAbilityChange(index, 'description', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        rows={2}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                        Добавить героя
                    </button>
                </form>
            </div>
        </div>
    );
} 