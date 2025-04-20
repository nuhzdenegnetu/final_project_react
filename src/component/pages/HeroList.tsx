import AddHeroForm from "../ui/AddHeroForm.tsx";
import { DeleteHeroButton } from "../ui/DeleteHeroButton";
import { Pagination } from "../ui/Pagination";
import {Hero} from "../../types/news.interface.ts";
import { API_URL_HEROES } from "../../const/API_MOCKS.ts";
import { useFetch, useFilter, useModal } from "../../hooks";
import { useState, useEffect, useCallback, useMemo } from "react";

export default function HeroList() {
    const { data: heroes, loading, error, refetch } = useFetch<Hero>(API_URL_HEROES);
    const { filter: role, filteredItems: filtered, handleFilterChange: handleRoleChange } = useFilter<Hero>(
        heroes, 
        'role' as keyof Hero, 
        'Все'
    );
    const { isOpen: showModal, openModal, closeModal } = useModal(false);
    const [animatedHeroes, setAnimatedHeroes] = useState<boolean[]>([]);
    
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
    }, [role]);

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
            setAnimatedHeroes(new Array(currentItems.length).fill(false));
            
            // Постепенно показываем каждую карточку с интервалом
            const timer = setTimeout(() => {
                currentItems.forEach((_, index) => {
                    setTimeout(() => {
                        setAnimatedHeroes(prev => {
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
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl text-purple-300">Загрузка героев...</p>
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
            <h1 className="text-3xl font-bold mb-6 text-center text-purple-300 border-b border-purple-800 pb-4">
                Герои Dota 2
            </h1>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-gray-800 p-4 rounded-lg">
                <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                    <option value="Все">Все роли</option>
                    <option value="Керри">Керри</option>
                    <option value="Поддержка">Поддержка</option>
                    <option value="Нюкер">Нюкер</option>
                    <option value="Дизейблер">Дизейблер</option>
                    <option value="Инициатор">Инициатор</option>
                </select>

                <button
                    onClick={openModal}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Добавить героя
                </button>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 bg-opacity-50 rounded-xl">
                    <img 
                        src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/browse_no_results.png" 
                        alt="Ничего не найдено" 
                        className="mx-auto h-32 mb-4 opacity-60"
                    />
                    <p className="text-xl text-gray-400 mb-2">Герои не найдены</p>
                    <p className="text-gray-500">Попробуйте изменить критерии поиска или добавьте нового героя</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentItems.map((hero, index) => (
                            <div 
                                key={hero.id} 
                                className={`bg-gray-800 border border-gray-700 shadow-lg rounded-2xl overflow-hidden transition-all duration-500 transform ${
                                    animatedHeroes[index] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                } hover:shadow-purple-500/20 hover:shadow-xl hover:-translate-y-1`}
                            >
                                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-3">
                                    <div className="flex items-center">
                                        <img 
                                            src={hero.portrait} 
                                            alt={hero.name} 
                                            className="w-20 h-20 mr-3 rounded-lg object-cover shadow-md border-2 border-purple-700"
                                        />
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-white">{hero.name}</h2>
                                            <span className="inline-block bg-purple-800 text-purple-200 px-3 py-1 rounded-full text-sm mt-1">
                                                {hero.role}
                                            </span>
                                        </div>
                                        <div>
                                            <DeleteHeroButton id={hero.id} onSuccess={handleDeleteSuccess} />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4">
                                    <h3 className="font-semibold text-purple-400 mb-3 text-lg border-b border-gray-700 pb-2">
                                        Способности
                                    </h3>
                                    <ul className="space-y-3">
                                        {hero.abilities.map((ability, index) => (
                                            <li key={index} className="p-3 bg-gray-900 bg-opacity-50 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                                                <p className="font-medium text-white flex items-center">
                                                    <span className="inline-block w-6 h-6 bg-purple-700 rounded-full mr-2 ability-num">
                                                        {index + 1}
                                                    </span>
                                                    {ability.name}
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1 pl-8">{ability.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        color="purple"
                    />
                </>
            )}

            <AddHeroForm
                showModal={showModal}
                setShowModal={closeModal}
            />
        </div>
    );
} 