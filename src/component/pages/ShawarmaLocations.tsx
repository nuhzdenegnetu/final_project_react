import {useEffect, useState} from "react";
import {ShawarmaLocation} from "../../types/products.interface.ts";
import axios from "axios";


const ShawarmaLocations = () => {
    const [news, setNews] = useState<ShawarmaLocation[]>([]);

    useEffect(() => {
        axios.get("https://6801397881c7e9fbcc41e8fd.mockapi.io/database")
            .then(response => setNews(response.data))
            .catch(err => console.error("Ошибка при загрузке данных:", err));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Точки с шаурмой:</h1>
            {news.map((item) => (
                <div key={item.id} className="mb-4 p-4 bg-white shadow rounded-2xl">
                    <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                    <p className="text-gray-700">{item.address}</p>
                    <p className="text-gray-500">Рейтинг: {item.averageRating}</p>
                    <p className="text-gray-500">Отзывы: {item.review}</p>
                    <img src={item.photo} alt={item.name} className="w-[200px] h-[200px] rounded-lg mt-2 -ml-2"/>
                </div>
            ))}
        </div>
    );
};

export default ShawarmaLocations;