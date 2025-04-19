import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import HeroList from "./component/pages/HeroList";
import HeroDetails from "./component/pages/HeroDetails";
import ItemsPage from "./component/pages/ItemsPage";
import ForumPage from "./component/pages/ForumPage";

export default function App() {
    return (
        <Router>
            <div className="p-4 font-mono bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-blue-700 mb-4">Dota 2 Вики-Герои</h1>
                        <nav className="mb-6 flex gap-6 font-semibold text-blue-600 justify-center text-xl">
                            <Link to="/"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transform transition-transform hover:scale-105">
                                Форум
                            </Link>
                            <Link to="/heroes"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transform transition-transform hover:scale-105">
                                Герои
                            </Link>
                            <Link to="/details"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transform transition-transform hover:scale-105">
                                Детали Героев
                            </Link>
                            <Link to="/items"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transform transition-transform hover:scale-105">
                                Предметы
                            </Link>
                        </nav>
                    </header>
                    <main>
                        <Routes>
                            <Route path="/" element={<ForumPage />} />
                            <Route path="/heroes" element={<HeroList />} />
                            <Route path="/details" element={<HeroDetails />} />
                            <Route path="/items" element={<ItemsPage />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}