export interface Caravan {
    id: number;
    ownerId: number;
    name: string;
    capacity: number;
    amenities: string[];
    photos: string[];
    location: {
        address: string;
        latitude?: number;
        longitude?: number;
        city?: string;
        country?: string;
    };
    status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
    dailyRate: number;
    nearbyFacilities?: { type: string; name: string; distance: string }[];
    tags?: string[];
}
