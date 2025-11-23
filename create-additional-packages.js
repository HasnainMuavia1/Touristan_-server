const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models
const Package = require('./models/Package');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const createAdditionalPackages = async () => {
  try {
    console.log('Creating additional packages...');

    // Package 1: Rawalpindi to Islamabad - PC Hotel
    const pcHotelPackage = {
      title: 'Rawalpindi to Islamabad City Tour',
      desc: 'Discover the twin cities of Rawalpindi and Islamabad with a luxurious stay at PC Hotel. Experience the perfect blend of historical charm and modern elegance. This package includes guided tours of historical landmarks, shopping at famous markets, and comfortable accommodation at PC Hotel with world-class amenities. Explore Faisal Mosque, Pakistan Monument, Lok Virsa Museum, and enjoy the vibrant food scene of the twin cities.',
      startPoint: 'Rawalpindi',
      destinations: ['Islamabad', 'Faisal Mosque', 'Pakistan Monument', 'Lok Virsa Museum'],
      duration: '4 days',
      price: 18000,
      rating: 4.7,
      img: 'https://images.unsplash.com/photo-1529245856630-f4853233d2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1529245856630-f4853233d2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      coordinates: [
        { place: 'Rawalpindi Railway Station', lat: 33.6167, lng: 73.0678 },
        { place: 'PC Hotel Islamabad', lat: 33.6844, lng: 73.0479 },
        { place: 'Faisal Mosque', lat: 33.7294, lng: 73.0381 },
        { place: 'Pakistan Monument', lat: 33.6938, lng: 73.0682 }
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival and Check-in at PC Hotel',
          description: 'Arrive in Rawalpindi and transfer to PC Hotel in Islamabad. Check-in to your comfortable room and freshen up. In the evening, enjoy a welcome dinner at the hotel\'s restaurant. Take a stroll around the hotel area to get familiar with the surroundings.'
        },
        {
          day: 2,
          title: 'Islamabad City Tour',
          description: 'After breakfast, embark on a comprehensive city tour. Visit the iconic Faisal Mosque, one of the largest mosques in the world. Explore the Pakistan Monument and Museum, which showcases the history and culture of Pakistan. Visit Lok Virsa Museum to learn about the country\'s heritage. Enjoy lunch at a local restaurant and return to the hotel in the evening.'
        },
        {
          day: 3,
          title: 'Rawalpindi Heritage and Shopping',
          description: 'Today, explore the historical city of Rawalpindi. Visit the famous Raja Bazaar and Saddar Bazaar for shopping. See the historical landmarks including the Rawalpindi Railway Station and old city areas. Experience the local culture and cuisine. Return to Islamabad for dinner at the hotel.'
        },
        {
          day: 4,
          title: 'Margalla Hills and Departure',
          description: 'Early morning optional hike in Margalla Hills for nature lovers. After breakfast, visit Daman-e-Koh viewpoint for panoramic views of Islamabad. Enjoy last-minute shopping or relaxation at the hotel. Check-out and departure with beautiful memories of the twin cities.'
        }
      ],
      hostelType: 'Premium',
      transportType: 'Luxury Bus',
      mealPlan: 'Half Board',
      activities: [
        'City Tour',
        'Historical Sites Visit',
        'Shopping',
        'Museum Tours',
        'Nature Walk',
        'Cultural Experience'
      ],
      hotelName: 'PC Hotel',
      cdn: 'https://sketchfab.com/3d-models/modern-apartment-interior-400c9069181a4342a7142433dfa3466e',
      featured: true,
      active: true
    };

    // Package 2: Sheikh Murre Trip - Hotel Murre Top
    const murreTopPackage = {
      title: 'Sheikh Murre Mountain Retreat',
      desc: 'Escape to the beautiful hill station of Murree and experience a relaxing stay at Hotel Murre Top. Enjoy the cool mountain air, scenic views, and peaceful atmosphere. This package includes comfortable accommodation, guided nature walks, visits to popular viewpoints, and delicious local cuisine. Perfect for families and couples looking for a refreshing mountain getaway.',
      startPoint: 'Islamabad',
      destinations: ['Murree', 'Pindi Point', 'Kashmir Point', 'Mall Road'],
      duration: '3 days',
      price: 15000,
      rating: 4.6,
      img: 'https://images.unsplash.com/photo-1586002990553-8850c4049470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1586002990553-8850c4049470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      coordinates: [
        { place: 'Islamabad', lat: 33.6844, lng: 73.0479 },
        { place: 'Hotel Murre Top', lat: 33.9078, lng: 73.3903 },
        { place: 'Pindi Point', lat: 33.9100, lng: 73.3900 },
        { place: 'Kashmir Point', lat: 33.9050, lng: 73.3850 }
      ],
      itinerary: [
        {
          day: 1,
          title: 'Journey to Murree and Check-in',
          description: 'Depart from Islamabad early morning and enjoy the scenic drive to Murree through winding mountain roads. Arrive at Hotel Murre Top and check-in to your cozy room with mountain views. After lunch, take a leisurely walk along Mall Road, the main shopping street of Murree. Enjoy the cool weather and explore local shops. Return to hotel for dinner and rest.'
        },
        {
          day: 2,
          title: 'Mountain Views and Nature',
          description: 'After breakfast, visit Pindi Point for breathtaking views of the surrounding mountains and valleys. Continue to Kashmir Point, another famous viewpoint offering panoramic vistas. Enjoy a nature walk in the pine forests. Have lunch at a local restaurant. In the afternoon, visit Patriata (New Murree) for cable car ride (optional, at additional cost). Return to hotel for evening tea and relaxation.'
        },
        {
          day: 3,
          title: 'Last Day in the Mountains',
          description: 'Enjoy a final breakfast with mountain views. Take a morning walk or visit any missed attractions. Do some last-minute shopping for souvenirs, local handicrafts, and traditional shawls. Check-out from the hotel and begin your journey back to Islamabad with beautiful memories of the mountains.'
        }
      ],
      hostelType: 'Standard',
      transportType: 'Luxury Bus',
      mealPlan: 'Half Board',
      activities: [
        'Mountain Viewing',
        'Nature Walks',
        'Shopping',
        'Photography',
        'Cable Car Ride (Optional)',
        'Local Cuisine'
      ],
      hotelName: 'Hotel Murre Top',
      cdn: 'https://sketchfab.com/3d-models/the-smoking-room-2247ed77976a40b6ae81271cd6b149c8',
      featured: true,
      active: true
    };

    // Check and create/update PC Hotel package
    const existingPCHotel = await Package.findOne({ title: 'Rawalpindi to Islamabad City Tour' });
    if (existingPCHotel) {
      console.log('PC Hotel package already exists. Updating...');
      Object.assign(existingPCHotel, pcHotelPackage);
      await existingPCHotel.save();
      console.log('PC Hotel package updated successfully!');
    } else {
      const createdPCHotel = await Package.create(pcHotelPackage);
      console.log('PC Hotel package created successfully!');
      console.log('Package ID:', createdPCHotel._id);
    }

    // Check and create/update Hotel Murre Top package
    const existingMurreTop = await Package.findOne({ title: 'Sheikh Murre Mountain Retreat' });
    if (existingMurreTop) {
      console.log('Hotel Murre Top package already exists. Updating...');
      Object.assign(existingMurreTop, murreTopPackage);
      await existingMurreTop.save();
      console.log('Hotel Murre Top package updated successfully!');
    } else {
      const createdMurreTop = await Package.create(murreTopPackage);
      console.log('Hotel Murre Top package created successfully!');
      console.log('Package ID:', createdMurreTop._id);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('Packages created/updated:');
    console.log('1. Rawalpindi to Islamabad City Tour - PC Hotel');
    console.log('2. Sheikh Murre Mountain Retreat - Hotel Murre Top');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating packages:', error);
    process.exit(1);
  }
};

// Run the migration
createAdditionalPackages();


