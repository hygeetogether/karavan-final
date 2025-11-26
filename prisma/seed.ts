import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create Hosts
    const host1 = await prisma.user.upsert({
        where: { email: 'alice@karravan.com' },
        update: {},
        create: {
            email: 'alice@karravan.com',
            name: 'Alice Wonderland',
            role: 'HOST',
            rating: 4.8,
            phone: '010-1234-5678',
        },
    });

    const host2 = await prisma.user.upsert({
        where: { email: 'bob@karravan.com' },
        update: {},
        create: {
            email: 'bob@karravan.com',
            name: 'Bob Builder',
            role: 'HOST',
            rating: 4.5,
            phone: '010-9876-5432',
        },
    });

    // Create Guests
    const guest1 = await prisma.user.upsert({
        where: { email: 'charlie@gmail.com' },
        update: {},
        create: {
            email: 'charlie@gmail.com',
            name: 'Charlie Chaplin',
            role: 'GUEST',
        },
    });

    // Create Caravans
    const caravan1 = await prisma.caravan.create({
        data: {
            ownerId: host1.id,
            name: 'Vintage Airstream by the Lake',
            capacity: 4,
            dailyRate: 150.0,
            status: 'AVAILABLE',
            amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Lake View'],
            photos: [
                'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            ],
            location: {
                address: '123 Lakeview Dr, Chuncheon',
                latitude: 37.8813,
                longitude: 127.7298
            },
            nearbyFacilities: [
                { type: 'Mart', name: 'Hanaro Mart', distance: '2km' },
                { type: 'Cafe', name: 'Lake Side Cafe', distance: '500m' }
            ],
            tags: ['Workcation', 'Lake View'],
        },
    });

    const caravan2 = await prisma.caravan.create({
        data: {
            ownerId: host2.id,
            name: 'Cozy Teardrop Trailer',
            capacity: 2,
            dailyRate: 85.0,
            status: 'AVAILABLE',
            amenities: ['Kitchenette', 'Solar Power', 'Awning'],
            photos: [
                'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            ],
            location: {
                address: '456 Mountain Rd, Gapyeong',
                latitude: 37.8315,
                longitude: 127.5106
            },
            nearbyFacilities: [
                { type: 'Hospital', name: 'Pet Care Center', distance: '3km' },
                { type: 'Park', name: 'Gapyeong Dog Park', distance: '1km' }
            ],
            tags: ['Pet-First', 'Cozy'],
        },
    });

    const caravan3 = await prisma.caravan.create({
        data: {
            ownerId: host1.id,
            name: 'Luxury Glamping Caravan',
            capacity: 6,
            dailyRate: 250.0,
            status: 'AVAILABLE',
            amenities: ['WiFi', 'Hot Tub', 'BBQ Grill', 'King Bed', 'Heating'],
            photos: [
                'https://images.unsplash.com/photo-1533630764838-89ac72b6d199?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            ],
            location: {
                address: '789 Forest Way, Yangpyeong',
                latitude: 37.4876,
                longitude: 127.4897
            },
            nearbyFacilities: [
                { type: 'Hospital', name: 'Yangpyeong Medical Center', distance: '1km' },
                { type: 'Pharmacy', name: 'Good Health Pharmacy', distance: '200m' }
            ],
            tags: ['Disaster Relief Available', 'Luxury'],
        },
    });

    console.log({ host1, host2, guest1, caravan1, caravan2, caravan3 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
