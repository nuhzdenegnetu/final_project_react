import {DotaHero} from "../../types/products.interface.ts";
import { API_URL_HEROES } from "../../const/API_MOCKS.ts";
import { useFetch } from "../../hooks";

const HeroDetails = () => {
    const { data: heroes, loading, error } = useFetch<DotaHero>(API_URL_HEROES);

    if (loading) {
        return <div className="text-center py-10">Загрузка данных о героях...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Подробная информация о героях Dota 2</h1>
            {heroes.map((hero) => (
                <div key={hero.id} className="mb-8 p-6 bg-white shadow-lg rounded-2xl">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <img 
                            src={hero.portrait} 
                            alt={hero.name} 
                            className="w-32 h-32 rounded-lg object-cover" 
                        />
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold mb-2">{hero.name}</h2>
                            <p className="text-lg font-medium text-blue-600 mb-4">Роль: {hero.role}</p>
                            
                            <h3 className="text-xl font-medium mb-3">Способности</h3>
                            <div className="space-y-4">
                                {hero.abilities.map((ability, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                        <h4 className="text-lg font-medium mb-1">{ability.name}</h4>
                                        <p className="text-gray-700">{ability.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HeroDetails; 