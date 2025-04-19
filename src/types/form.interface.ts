// Файл: src/types/form.interface.ts
export interface HeroForm {
    name: string;
    role: string;
    portrait?: string;
    abilities: {
        name: string;
        description: string;
    }[];
}

export interface ItemForm {
    name: string;
    icon?: string;
    price: string;
    category: string;
    description: string;
    attributes: string[];
}