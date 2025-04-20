import {BrowserRouter as Router, Link, Route, Routes, useLocation} from "react-router-dom";
import HeroList from "./component/pages/HeroList";
import HeroDetails from "./component/pages/HeroDetails";
import ItemsPage from "./component/pages/ItemsPage";
import ForumPage from "./component/pages/ForumPage";
import { useEffect } from "react";

// Компонент для прокрутки вверх при переходе на новую страницу
function ScrollToTop() {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
}

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="font-mono min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-blue-900 text-white">
                <div className="max-w-7xl mx-auto w-full px-4 flex-grow">
                    <header className="py-8 relative">
                        <div className="absolute inset-0 bg-[url('https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/backgrounds/greyfade.jpg')] bg-cover opacity-20 z-0"></div>
                        <div className="relative z-10">
                            <h1 className="text-6xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
                                Dota 2 Вики
                            </h1>
                            <nav className="mb-6 flex flex-wrap gap-4 justify-center">
                                <NavLink to="/" label="Форум" />
                                <NavLink to="/heroes" label="Герои" />
                                <NavLink to="/details" label="Детали Героев" />
                                <NavLink to="/items" label="Предметы" />
                            </nav>
                        </div>
                    </header>
                    <main className="bg-gray-800 bg-opacity-80 rounded-xl shadow-2xl p-6 backdrop-blur-sm mb-10">
                        <Routes>
                            <Route path="/" element={<ForumPage />} />
                            <Route path="/heroes" element={<HeroList />} />
                            <Route path="/details" element={<HeroDetails />} />
                            <Route path="/items" element={<ItemsPage />} />
                        </Routes>
                    </main>
                </div>
                <footer className="bg-gray-900 text-gray-400 py-6">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="mb-2">© 2025 Dota 2 Вики | Все права защищены</p>
                        <p className="text-sm">Dota 2 и все связанные с игрой материалы принадлежат Valve Corporation</p>
                        <div className="flex justify-center mt-4 space-x-4">
                            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Политика конфиденциальности</a>
                            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Условия использования</a>
                            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Контакты</a>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

// Компонент для кнопок навигации
function NavLink({ to, label }: { to: string, label: string }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <Link 
            to={to}
            className={`px-6 py-3 rounded-lg shadow-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/50 ${
                isActive 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-200 hover:bg-blue-700'
            }`}
        >
            {label}
        </Link>
    );
}