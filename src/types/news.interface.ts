export interface Review {
    id: string;
    name: string;
    address: string;
    averageRating: number;
    review: string;
    photo?: string;
    district: string;
}

export interface Ability {
  name: string;
  description: string;
}

export interface Hero {
  id: string;
  name: string;
  role: string;
  portrait: string;
  abilities: Ability[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  category: string;
}

export interface HomeNewsProps {
    reviews: Review[];
    heroes: Hero[];
    filtered: Review[] | Hero[];
    district: string;
    averageRating: string;
    showModal: boolean;
    setShowModal: (value: boolean) => void;
}

export interface ForumPageProps {
    posts: Post[];
    filteredPosts: Post[];
    category: string;
    showModal: boolean;
    setShowModal: (value: boolean) => void;
}