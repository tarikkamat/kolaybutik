import { Category } from './category';

export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price?: number | null;
    image?: string | null;
    category_id?: number;
    category?: Category;
    created_at?: string;
    updated_at?: string;
}

export type Products = Product[];
