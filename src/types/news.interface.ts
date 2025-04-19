export interface Review {
    id: string;
    name: string;
    address: string;
    averageRating: number;
    review: string;
    photo?: string;
    district: string;
}

export interface HomeNewsProps {
    reviews: Review[];
    filtered: Review[];
    district: string;
    averageRating: string;
    showModal: boolean;
    setShowModal: (value: boolean) => void;
}