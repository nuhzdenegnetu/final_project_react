import {useEffect, useState} from "react";
import axios from "axios";
import AddShawarmaForm from "./AddShawarmaForm.tsx";
import {Review} from "../../types/news.interface.ts";

interface HomeNewsState {
    reviews: Review[];
    filtered: Review[];
    district: string;
    averageRating: string;
    showModal: boolean;
}

export default function HomeNews() {
    const [state, setState] = useState<HomeNewsState>({
        reviews: [],
        filtered: [],
        district: "Все",
        averageRating: "Все",
        showModal: false,
    });

    useEffect(() => {
        axios
            .get("https://6801397881c7e9fbcc41e8fd.mockapi.io/database")
            .then((res) => {
                setState((prevState) => ({
                    ...prevState,
                    reviews: res.data,
                    filtered: res.data,
                }));
            })
            .catch((err) => console.error("Ошибка при загрузке отзывов:", err));
    }, []);

    useEffect(() => {
        const filteredReviews = state.reviews.filter((review) => {
            const matchesDistrict =
                state.district === "Все" || review.district === state.district;
            const matchesRating =
                state.averageRating === "Все" ||
                Number(review.averageRating) === Number(state.averageRating);

            return matchesDistrict && matchesRating;
        });

        setState((prevState) => ({ ...prevState, filtered: filteredReviews }));
    }, [state.district, state.averageRating, state.reviews]);

    const handleDistrictChange = (value: string) => {
        setState((prevState) => ({...prevState, district: value}));
    };

    const handleRatingChange = (value: string) => {
        setState((prevState) => ({...prevState, averageRating: value}));
    };

    const toggleModal = (value: boolean) => {
        setState((prevState) => ({...prevState, showModal: value}));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Отзывы по районам и оценкам</h1>

            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={state.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="Все">Все районы</option>
                    <option value="Центр">Центр</option>
                    <option value="Таирова">Таирова</option>
                    <option value="Посёлок Котовского">Посёлок Котовского</option>
                </select>

                <select
                    value={state.averageRating}
                    onChange={(e) => handleRatingChange(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="Все">Все оценки</option>
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                </select>

                <button
                    onClick={() => toggleModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Добавить точку
                </button>
            </div>

            <div className="space-y-4">
                {state.filtered.map((item) => (
                    <div key={item.id} className="p-4 bg-white shadow rounded-2xl">
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-gray-600">{item.address}</p>
                        <p className="text-yellow-600">Оценка: {item.averageRating}</p>
                    </div>
                ))}
            </div>

            <AddShawarmaForm
                showModal={state.showModal}
                setShowModal={toggleModal}
            />
        </div>
    );
}