import {BrowserRouter as Router, Link, Route, Routes} from "react-router";
import HomeNews from "./component/pages/HomeNews";
import ShawarmaLocations from "./component/pages/ShawarmaLocations";

export default function App() {
    return (
        <Router>
            <div className="p-4 font-mono bg-gray-50 min-h-screen">
                <nav className="mb-6 flex gap-6 font-semibold text-blue-600 justify-center text-2xl">
                    <Link to="/"
                          className="hover px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transform transition-transform hover:scale-105">Главная</Link>
                    <Link to="/locations"
                          className="hover px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transform transition-transform hover:scale-105">Отзывы</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<HomeNews/>}/>
                    <Route path="/locations" element={<ShawarmaLocations/>}/>
                </Routes>
            </div>
        </Router>
    );
}