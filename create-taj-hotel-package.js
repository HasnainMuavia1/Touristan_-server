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

const createTajHotelPackage = async () => {
  try {
    console.log('Creating Taj Hotel package...');

    // Check if package already exists
    const existingPackage = await Package.findOne({ title: 'Luxury Stay at Taj Hotel' });
    
    if (existingPackage) {
      console.log('Taj Hotel package already exists. Updating...');
      
      // Update existing package
      existingPackage.hotelName = 'Taj Hotel';
      existingPackage.cdn = 'https://sketchfab.com/3d-models/b-hotel-reception-baking-2b369ab3f98742629becd0ed33016c84';
      existingPackage.title = 'Luxury Stay at Taj Hotel';
      existingPackage.desc = 'Experience world-class luxury and hospitality at the iconic Taj Hotel. Enjoy premium accommodations, fine dining, and exceptional service in the heart of the city. Our exclusive package includes deluxe room accommodation, complimentary breakfast, access to spa and wellness facilities, and personalized concierge services.';
      existingPackage.startPoint = 'Karachi';
      existingPackage.destinations = ['Taj Hotel', 'City Center', 'Shopping District'];
      existingPackage.duration = '3 days';
      existingPackage.price = 25000;
      existingPackage.rating = 4.9;
      existingPackage.img = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
      existingPackage.images = [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ];
      existingPackage.coordinates = [
        { place: 'Taj Hotel', lat: 24.8607, lng: 67.0011 },
        { place: 'City Center', lat: 24.8600, lng: 67.0100 }
      ];
      existingPackage.itinerary = [
        {
          day: 1,
          title: 'Arrival and Check-in',
          description: 'Welcome to Taj Hotel! Check-in to your luxurious room, enjoy a welcome drink, and take some time to relax. In the evening, explore the hotel facilities including the spa, fitness center, and rooftop pool. Dinner will be served at our award-winning restaurant.'
        },
        {
          day: 2,
          title: 'City Exploration',
          description: 'After a sumptuous breakfast, embark on a guided city tour. Visit historical landmarks, explore local markets, and experience the vibrant culture. Return to the hotel for a relaxing spa session. Evening is free for you to enjoy the hotel\'s fine dining options or explore the nightlife.'
        },
        {
          day: 3,
          title: 'Leisure and Departure',
          description: 'Enjoy a leisurely breakfast and make use of the hotel facilities. Check-out is at 12 PM, but you can store your luggage and continue to enjoy the hotel amenities. Optional: Late checkout available upon request.'
        }
      ];
      existingPackage.hostelType = 'Luxury';
      existingPackage.transportType = 'Luxury Bus';
      existingPackage.mealPlan = 'Full Board';
      existingPackage.activities = [
        'Spa and Wellness',
        'City Tour',
        'Fine Dining',
        'Swimming Pool Access',
        'Fitness Center',
        'Concierge Services'
      ];
      existingPackage.featured = true;
      existingPackage.active = true;

      await existingPackage.save();
      console.log('Taj Hotel package updated successfully!');
    } else {
      // Create new package
      const tajHotelPackage = await Package.create({
        title: 'Luxury Stay at Taj Hotel',
        desc: 'Experience world-class luxury and hospitality at the iconic Taj Hotel. Enjoy premium accommodations, fine dining, and exceptional service in the heart of the city. Our exclusive package includes deluxe room accommodation, complimentary breakfast, access to spa and wellness facilities, and personalized concierge services.',
        startPoint: 'Karachi',
        destinations: ['Taj Hotel', 'City Center', 'Shopping District'],
        duration: '3 days',
        price: 25000,
        rating: 4.9,
        img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        coordinates: [
          { place: 'Taj Hotel', lat: 24.8607, lng: 67.0011 },
          { place: 'City Center', lat: 24.8600, lng: 67.0100 }
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival and Check-in',
            description: 'Welcome to Taj Hotel! Check-in to your luxurious room, enjoy a welcome drink, and take some time to relax. In the evening, explore the hotel facilities including the spa, fitness center, and rooftop pool. Dinner will be served at our award-winning restaurant.'
          },
          {
            day: 2,
            title: 'City Exploration',
            description: 'After a sumptuous breakfast, embark on a guided city tour. Visit historical landmarks, explore local markets, and experience the vibrant culture. Return to the hotel for a relaxing spa session. Evening is free for you to enjoy the hotel\'s fine dining options or explore the nightlife.'
          },
          {
            day: 3,
            title: 'Leisure and Departure',
            description: 'Enjoy a leisurely breakfast and make use of the hotel facilities. Check-out is at 12 PM, but you can store your luggage and continue to enjoy the hotel amenities. Optional: Late checkout available upon request.'
          }
        ],
        hostelType: 'Luxury',
        transportType: 'Luxury Bus',
        mealPlan: 'Full Board',
        activities: [
          'Spa and Wellness',
          'City Tour',
          'Fine Dining',
          'Swimming Pool Access',
          'Fitness Center',
          'Concierge Services'
        ],
        hotelName: 'Taj Hotel',
        cdn: 'https://sketchfab.com/3d-models/b-hotel-reception-baking-2b369ab3f98742629becd0ed33016c84',
        featured: true,
        active: true
      });

      console.log('Taj Hotel package created successfully!');
      console.log('Package ID:', tajHotelPackage._id);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating Taj Hotel package:', error);
    process.exit(1);
  }
};

// Run the migration
createTajHotelPackage();


