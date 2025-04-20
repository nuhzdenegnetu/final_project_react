import {DotaHero} from "../../types/products.interface.ts";
import { API_URL_HEROES } from "../../const/API_MOCKS.ts";
import { useFetch } from "../../hooks";
import { useState, useEffect, useCallback, useMemo } from "react";
import { DeleteHeroButton } from "../ui/DeleteHeroButton";
import { Pagination } from "../ui/Pagination";

const HeroDetails = () => {
    const { data: heroes, loading, error, refetch } = useFetch<DotaHero>(API_URL_HEROES);
    const [animatedHeroes, setAnimatedHeroes] = useState<boolean[]>([]);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;
    
    // Calculate total pages
    const totalPages = useMemo(() => 
        Math.ceil(heroes.length / ITEMS_PER_PAGE),
        [heroes.length]
    );
    
    // Get current page items
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return heroes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [heroes, currentPage]);

    const handleDeleteSuccess = useCallback(() => {
        refetch();
    }, [refetch]);
    
    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Reset animations
        setAnimatedHeroes(new Array(Math.min(ITEMS_PER_PAGE, heroes.length)).fill(false));
    };

    // Эффект для анимированного появления карточек
    useEffect(() => {
        if (currentItems.length > 0) {
            // Постепенно показываем каждую карточку с интервалом
            const timer = setTimeout(() => {
                currentItems.forEach((_, index) => {
                    setTimeout(() => {
                        setAnimatedHeroes(prev => {
                            const newState = [...prev];
                            newState[index] = true;
                            return newState;
                        });
                    }, index * 150);
                });
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [currentItems]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl text-blue-300">Загрузка данных о героях...</p>
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
            <h1 className="text-3xl font-bold mb-8 text-center text-blue-300 border-b border-blue-800 pb-4">
                Подробная информация о героях Dota 2
            </h1>
            
            <div className="space-y-10">
                {currentItems.map((hero, index) => (
                    <div 
                        key={hero.id} 
                        className={`transform transition-all duration-700 ${
                            animatedHeroes[index] ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
                        }`}
                    >
                        <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4">
                                <div className="flex flex-col md:flex-row items-start gap-6">
                                    <img 
                                        src={hero.portrait} 
                                        alt={hero.name} 
                                        className="w-32 h-32 rounded-lg object-cover border-2 border-purple-500 shadow-lg"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-3xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                                                    {hero.name}
                                                </h2>
                                                <div className="inline-block bg-purple-800 text-purple-200 px-4 py-1 rounded-full text-sm mt-1 mb-4">
                                                    {hero.role}
                                                </div>
                                            </div>
                                            <DeleteHeroButton id={hero.id} onSuccess={handleDeleteSuccess} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-2xl font-medium mb-4 text-purple-400 border-b border-gray-700 pb-2">
                                    Способности
                                </h3>
                                <div className="space-y-4">
                                    {hero.abilities.map((ability, index) => (
                                        <div key={index} className="p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-800 hover:bg-gray-700 transition-colors duration-200">
                                            <div className="flex items-center mb-2">
                                                <span className="w-8 h-8 bg-purple-700 rounded-full mr-3 text-white ability-num">
                                                    {index + 1}
                                                </span>
                                                <h4 className="text-xl font-medium text-white">{ability.name}</h4>
                                            </div>
                                            <p className="text-gray-400 pl-11">{ability.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
        </div>
    );
};

export default HeroDetails; 