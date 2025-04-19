import {DotaItem} from "../../types/products.interface.ts";
import { API_URL_ITEMS } from "../../const/API_MOCKS";
import { useFetch, useFilter, useModal } from "../../hooks";
import AddItemForm from "../ui/AddItemForm";

const ItemsPage = () => {
    const { data: items, loading, error } = useFetch<DotaItem>(API_URL_ITEMS);
    const { filter: category, filteredItems: filtered, handleFilterChange: handleCategoryChange } = 
        useFilter<DotaItem>(items, 'category' as keyof DotaItem, 'Все');
    const { isOpen: showModal, openModal, closeModal } = useModal(false);

    if (loading) {
        return <div className="text-center py-10">Загрузка предметов...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Предметы Dota 2</h1>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="Все">Все категории</option>
                    <option value="Расходуемые">Расходуемые</option>
                    <option value="Атрибуты">Атрибуты</option>
                    <option value="Оружие">Оружие</option>
                    <option value="Броня">Броня</option>
                    <option value="Артефакты">Артефакты</option>
                    <option value="Нейтральные">Нейтральные</option>
                </select>
                
                <button
                    onClick={openModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Добавить предмет
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => (
                    <div key={item.id} className="p-4 bg-white shadow rounded-2xl">
                        <div className="flex items-center mb-2">
                            <img src={item.icon} alt={item.name} className="w-16 h-16 mr-3 rounded-lg" />
                            <div>
                                <h2 className="text-xl font-semibold">{item.name}</h2>
                                <p className="text-gray-600">Категория: {item.category}</p>
                                <p className="text-yellow-600">Цена: {item.price} золота</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mt-2">{item.description}</p>
                        {item.attributes && (
                            <div className="mt-3">
                                <h3 className="font-semibold mb-1">Атрибуты:</h3>
                                <ul className="space-y-1">
                                    {item.attributes.map((attr, index) => (
                                        <li key={index} className="text-sm text-gray-600">• {attr}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <AddItemForm 
                showModal={showModal}
                setShowModal={closeModal}
            />
        </div>
    );
};

export default ItemsPage; 