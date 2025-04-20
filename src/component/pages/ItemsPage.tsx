import {DotaItem} from "../../types/products.interface.ts";
import { API_URL_ITEMS } from "../../const/API_MOCKS";
import { useFetch, useFilter, useModal } from "../../hooks";
import AddItemForm from "../ui/AddItemForm";
import { DeleteItemButton } from "../ui/DeleteItemButton";
import { Pagination } from "../ui/Pagination";
import { useState, useEffect, useCallback, useMemo } from "react";

const ItemsPage = () => {
    const { data: items, loading, error, refetch } = useFetch<DotaItem>(API_URL_ITEMS);
    const { filter: category, filteredItems: filtered, handleFilterChange: handleCategoryChange } = 
        useFilter<DotaItem>(items, 'category' as keyof DotaItem, 'Все');
    const { isOpen: showModal, openModal, closeModal } = useModal(false);
    const [animatedItems, setAnimatedItems] = useState<boolean[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;
    
    // Calculate total pages
    const totalPages = useMemo(() => 
        Math.ceil(filtered.length / ITEMS_PER_PAGE),
        [filtered.length]
    );
    
    // Get current page items
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);
    
    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [category]);

    const handleDeleteSuccess = useCallback(() => {
        refetch();
    }, [refetch]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Эффект для анимированного появления карточек
    useEffect(() => {
        if (currentItems.length > 0) {
            // Сбрасываем анимации при изменении страницы или фильтра
            setAnimatedItems(new Array(currentItems.length).fill(false));
            
            // Постепенно показываем каждую карточку с интервалом
            const timer = setTimeout(() => {
                currentItems.forEach((_, index) => {
                    setTimeout(() => {
                        setAnimatedItems(prev => {
                            const newState = [...prev];
                            newState[index] = true;
                            return newState;
                        });
                    }, index * 100); // 100ms интервал между появлением карточек
                });
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [currentItems]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl text-blue-300">Загрузка предметов...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 bg-red-900 bg-opacity-20 rounded-xl p-6 border border-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl text-red-400">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-300 border-b border-blue-800 pb-4">
                Предметы Dota 2
            </h1>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-gray-800 p-4 rounded-lg">
                <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Добавить предмет
                </button>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 bg-opacity-50 rounded-xl">
                    <img 
                        src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/browse_no_results.png" 
                        alt="Ничего не найдено" 
                        className="mx-auto h-32 mb-4 opacity-60"
                    />
                    <p className="text-xl text-gray-400 mb-2">Предметы не найдены</p>
                    <p className="text-gray-500">Попробуйте изменить критерии поиска или добавьте новый предмет</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentItems.map((item, index) => (
                            <div 
                                key={item.id} 
                                className={`bg-gray-800 border border-gray-700 shadow-lg rounded-2xl overflow-hidden transition-all duration-500 transform ${
                                    animatedItems[index] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                } hover:shadow-blue-500/20 hover:shadow-xl hover:-translate-y-1`}
                            >
                                <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-2">
                                    <div className="flex items-center">
                                        <img 
                                            src={item.icon} 
                                            alt={item.name} 
                                            className="w-16 h-16 mr-3 rounded-lg object-cover shadow-md" 
                                        />
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-white">{item.name}</h2>
                                            <div className="flex mt-1 space-x-2">
                                                <span className="text-sm bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                                                    {item.category}
                                                </span>
                                                <span className="text-sm bg-yellow-800 text-yellow-300 px-2 py-0.5 rounded">
                                                    {item.price} золота
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <DeleteItemButton id={item.id} onSuccess={handleDeleteSuccess} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-gray-300 mt-2">{item.description}</p>
                                    {item.attributes && item.attributes.length > 0 && (
                                        <div className="mt-4 border-t border-gray-700 pt-3">
                                            <h3 className="font-semibold text-blue-400 mb-2">Атрибуты:</h3>
                                            <ul className="space-y-1">
                                                {item.attributes.map((attr, index) => (
                                                    <li key={index} className="text-sm text-gray-400 flex items-center">
                                                        <span className="text-blue-500 mr-2">•</span>
                                                        {attr}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        color="blue"
                    />
                </>
            )}

            <AddItemForm 
                showModal={showModal}
                setShowModal={closeModal}
            />
        </div>
    );
};

export default ItemsPage; 