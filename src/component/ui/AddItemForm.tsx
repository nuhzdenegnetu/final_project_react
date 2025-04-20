import { useState } from "react";
import { ModalProps } from "../../types/modal.interface.ts";
import { ItemForm } from "../../types/form.interface.ts";
import axios from "axios";
import { API_URL_ITEMS } from "../../const/API_MOCKS";
import ReactDOM from "react-dom";

export default function AddItemForm({ showModal, setShowModal }: ModalProps) {
    const [form, setForm] = useState<ItemForm>({
        name: "",
        icon: "",
        price: 0,
        category: "Расходуемые",
        description: "",
        attributes: [""]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.name === "price" 
            ? Number(e.target.value) 
            : e.target.value;
        
        setForm({ ...form, [e.target.name]: value });
    };

    const handleAttributeChange = (index: number, value: string) => {
        const updatedAttributes = [...form.attributes];
        updatedAttributes[index] = value;
        setForm({ ...form, attributes: updatedAttributes });
    };

    const addAttribute = () => {
        setForm({ ...form, attributes: [...form.attributes, ""] });
    };

    const removeAttribute = (index: number) => {
        const updatedAttributes = form.attributes.filter((_, i) => i !== index);
        setForm({ ...form, attributes: updatedAttributes });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Проверка обязательных полей
        if (!form.name.trim() || !form.description.trim()) {
            alert("Пожалуйста, заполните все обязательные поля");
            return;
        }

        // Проверка, что цена - положительное число
        if (form.price < 0) {
            alert("Цена должна быть положительным числом");
            return;
        }

        // Фильтруем пустые атрибуты
        const filteredAttributes = form.attributes.filter(attr => attr.trim() !== "");

        try {
            // Создаем объект предмета
            const itemData = {
                ...form,
                attributes: filteredAttributes.length > 0 ? filteredAttributes : undefined,
                icon: form.icon?.trim() ? form.icon.trim() : "https://via.placeholder.com/150?text=Нет+изображения"
            };

            // Отправляем данные на сервер
            const response = await axios.post(API_URL_ITEMS, itemData);
            console.log("Новый предмет отправлен:", response.data);
            alert("Предмет успешно добавлен!");
            
            // Сбрасываем форму
            setForm({
                name: "",
                icon: "",
                price: 0,
                category: "Расходуемые",
                description: "",
                attributes: [""]
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
            <div className="bg-gray-900 border border-blue-800 p-5 rounded-xl shadow-2xl shadow-blue-500/20 w-full max-w-xl relative m-4">
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4 text-blue-300 border-b border-blue-800 pb-2">
                    Добавить новый предмет
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-gray-200">
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Название предмета</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Название предмета"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                                URL иконки <span className="text-gray-500 text-xs">(необязательно)</span>
                            </label>
                            <input
                                type="url"
                                name="icon"
                                placeholder="URL изображения"
                                value={form.icon}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-1">Цена (золото)</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="Цена предмета"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Категория</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            required
                        >
                            <option value="Расходуемые">Расходуемые</option>
                            <option value="Атрибуты">Атрибуты</option>
                            <option value="Оружие">Оружие</option>
                            <option value="Броня">Броня</option>
                            <option value="Артефакты">Артефакты</option>
                            <option value="Нейтральные">Нейтральные</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Описание</label>
                        <textarea
                            name="description"
                            placeholder="Описание предмета"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            rows={2}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-blue-300">
                                Атрибуты <span className="text-gray-500 text-xs">(необязательно)</span>
                            </label>
                            <button
                                type="button"
                                onClick={addAttribute}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg transition-colors duration-200"
                            >
                                + Добавить атрибут
                            </button>
                        </div>

                        <div className="max-h-24 overflow-y-auto pr-1">
                            {form.attributes.map((attribute, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder={`Атрибут ${index + 1}`}
                                        value={attribute}
                                        onChange={(e) => handleAttributeChange(index, e.target.value)}
                                        className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    />
                                    {form.attributes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAttribute(index)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg w-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/50 mt-2"
                    >
                        Добавить предмет
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
} 