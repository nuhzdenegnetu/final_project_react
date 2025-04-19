import AddHeroForm from "../ui/AddHeroForm.tsx";
import {Hero} from "../../types/news.interface.ts";
import { API_URL_HEROES } from "../../const/API_MOCKS.ts";
import { useFetch, useFilter, useModal } from "../../hooks";

export default function HeroList() {
    const { data: heroes, loading, error } = useFetch<Hero>(API_URL_HEROES);
    const { filter: role, filteredItems: filtered, handleFilterChange: handleRoleChange } = useFilter<Hero>(
        heroes, 
        'role' as keyof Hero, 
        'Все'
    );
    const { isOpen: showModal, openModal, closeModal } = useModal(false);

    if (loading) {
        return <div className="text-center py-10">Загрузка героев...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Герои Dota 2</h1>

            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="border p-2 rounded"
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
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Добавить героя
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((hero) => (
                    <div key={hero.id} className="p-4 bg-white shadow rounded-2xl">
                        <div className="flex items-center mb-2">
                            <img src={hero.portrait} alt={hero.name} className="w-16 h-16 mr-3 rounded-lg" />
                            <div>
                                <h2 className="text-xl font-semibold">{hero.name}</h2>
                                <p className="text-gray-600">Роль: {hero.role}</p>
                            </div>
                        </div>
                        <h3 className="font-semibold mt-3 mb-1">Способности:</h3>
                        <ul className="space-y-2">
                            {hero.abilities.map((ability, index) => (
                                <li key={index} className="p-2 bg-gray-50 rounded">
                                    <p className="font-medium">{ability.name}</p>
                                    <p className="text-sm text-gray-600">{ability.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <AddHeroForm
                showModal={showModal}
                setShowModal={closeModal}
            />
        </div>
    );
} 