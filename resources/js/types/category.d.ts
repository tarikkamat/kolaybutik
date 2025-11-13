export interface Category {
    id: number;
    name: string;
    slug: string;
    products_count?: number;
    created_at?: string;
    updated_at?: string;
}

export type Categories = Category[];
