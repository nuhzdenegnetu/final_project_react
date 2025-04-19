import { Ability } from './news.interface';

export interface ShawarmaLocation {
  id: number;
  name: string;
  address: string;
  averageRating: number;
  review: string;
    photo: string;
}

export interface DotaHero {
  id: string;
  name: string;
  role: string;
  portrait: string;
  abilities: Ability[];
}

export interface DotaItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  category: string;
  description: string;
  attributes?: string[];
}