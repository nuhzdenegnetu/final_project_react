// Файл: src/pages/AddShawarmaForm.tsx
import {useState} from "react";
import axios from "axios";
import {ModalProps} from "../../types/modal.interface.ts";
import {ShawarmaForm} from "../../types/form.interface.ts";

export default function AddShawarmaForm({showModal, setShowModal}: ModalProps) {
    const [form, setForm] = useState<ShawarmaForm>({
        name: "",
        address: "",
        averageRating: "",
        review: "",
        photo: "",
        district: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post("https://6801397881c7e9fbcc41e8fd.mockapi.io/database", form);
            alert("Спасибо за добавление новой точки!");
            setForm({
                name: "",
                address: "",
                averageRating: "",
                review: "",
                photo: "",
                district: ""
            });
            setShowModal(false);
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Произошла ошибка при добавлении. Пожалуйста, попробуйте снова.");
        }
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                >✖
                </button>
                <h2 className="text-xl font-semibold mb-4">Добавить точку</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Название"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Адрес"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <select
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Выберите район</option>
                        <option value="Центр">Центр</option>
                        <option value="Таирова">Таирова</option>
                        <option value="Посёлок Котовского">Посёлок Котовского</option>
                    </select>
                    <input
                        type="number"
                        name="averageRating"
                        placeholder="Оценка (1-5)"
                        value={form.averageRating}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        name="review"
                        placeholder="Отзыв"
                        value={form.review}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows={3}
                        required
                    />
                    <input
                        type="url"
                        name="photo"
                        placeholder="Ссылка на фото"
                        value={form.photo}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
                        Добавить
                    </button>
                </form>
            </div>
        </div>
    );
}