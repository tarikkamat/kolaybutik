export interface IyzicoLink {
    token: string;
    url: string;
    imageUrl?: string;
    iyziLinkId?: string;
    name: string;
    description?: string;
    price: string;
    currency: string;
    status: string;
    createdDate?: string;
    updatedDate?: string;
}

export type TabType = 'create' | 'fastlink' | 'list' | 'retrieve' | 'update' | 'delete';

