import { useState } from "react";
import { ModalProps } from "../../types/modal.interface.ts";
import { ItemForm } from "../../types/form.interface.ts";
import axios from "axios";
import { API_URL_ITEMS } from "../../const/API_MOCKS";

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

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                >✖
                </button>
                <h2 className="text-xl font-semibold mb-4">Добавить новый предмет</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название предмета</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Название предмета"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL иконки <span className="text-gray-500 text-xs">(необязательно)</span>
                        </label>
                        <input
                            type="url"
                            name="icon"
                            placeholder="URL изображения предмета"
                            value={form.icon}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Оставьте поле пустым, если изображение не требуется</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цена (золото)</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Цена предмета"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                        <textarea
                            name="description"
                            placeholder="Описание предмета"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">
                                Атрибуты <span className="text-gray-500 text-xs">(необязательно)</span>
                            </label>
                            <button
                                type="button"
                                onClick={addAttribute}
                                className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                            >
                                + Добавить атрибут
                            </button>
                        </div>

                        {form.attributes.map((attribute, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={`Атрибут ${index + 1}`}
                                    value={attribute}
                                    onChange={(e) => handleAttributeChange(index, e.target.value)}
                                    className="flex-1 p-2 border rounded"
                                />
                                {form.attributes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeAttribute(index)}
                                        className="text-red-500"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                        Добавить предмет
                    </button>
                </form>
            </div>
        </div>
    );
} 