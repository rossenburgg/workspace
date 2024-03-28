require('dotenv').config();
const mongoose = require('mongoose');
const Court = require('./models/courtModel'); // Adjust path as necessary

const courts = [
  {
    location: { type: "Point", coordinates: [-0.186964, 5.603717] }, // Accra, Ghana
    picturesUrls: [
      'https://example.com/accra-court1.jpg',
      'https://example.com/accra-court2.jpg'
    ],
    reviews: [
      { text: 'Vibrant atmosphere and well-maintained court.', author: 'Kwame Nkrumah' },
      { text: 'Perfect location for evening games.', author: 'Yaa Asantewaa' }
    ]
  },
  {
    location: { type: "Point", coordinates: [-0.205744, 5.560014] }, // Accra, Ghana
    picturesUrls: [
      'https://example.com/accra-court3.jpg',
      'https://example.com/accra-court4.jpg'
    ],
    reviews: [
      { text: 'Great court with friendly locals.', author: 'Efua Sutherland' },
      { text: 'The court surface is excellent for basketball.', author: 'Kofi Annan' }
    ]
  },
  {
    location: { type: "Point", coordinates: [-0.264390, 5.654131] }, // Accra, Ghana
    picturesUrls: [
      'https://example.com/accra-court5.jpg',
      'https://example.com/accra-court6.jpg'
    ],
    reviews: [
      { text: 'Easily accessible and always open to the public.', author: 'Ama Ata Aidoo' },
      { text: 'The hoops are in great condition.', author: 'Kwesi Brew' }
    ]
  },
  // Adding more courts near the user's location for testing
  {
    location: { type: "Point", coordinates: [-0.196107, 5.650354] }, // Near Accra, Ghana
    picturesUrls: [
      'https://example.com/accra-court7.jpg',
      'https://example.com/accra-court8.jpg'
    ],
    reviews: [
      { text: 'Fantastic court right in the heart of the city.', author: 'Michael Essien' },
      { text: 'Lights for night games are a big plus.', author: 'Asamoah Gyan' }
    ]
  },
  {
    location: { type: "Point", coordinates: [-0.210736, 5.635387] }, // Near Accra, Ghana
    picturesUrls: [
      'https://example.com/accra-court9.jpg',
      'https://example.com/accra-court10.jpg'
    ],
    reviews: [
      { text: 'Well maintained and rarely crowded.', author: 'Abeiku Santana' },
      { text: 'Great place for weekend games.', author: 'Dede Ayew' }
    ]
  },
  // Adding courts in Tema, Ghana
  {
    location: { type: "Point", coordinates: [-0.0167, 5.6674] }, // Tema, Ghana
    picturesUrls: [
      'https://example.com/tema-court1.jpg',
      'https://example.com/tema-court2.jpg'
    ],
    reviews: [
      { text: 'Great evening games.', author: 'Jane Doe' },
      { text: 'Well maintained court.', author: 'John Doe' }
    ]
  },
  {
    location: { type: "Point", coordinates: [-0.0028, 5.6404] }, // Tema, Ghana
    picturesUrls: [
      'https://example.com/tema-court3.jpg',
      'https://example.com/tema-court4.jpg'
    ],
    reviews: [
      { text: 'Fantastic atmosphere and excellent location.', author: 'Kwesi Appiah' },
      { text: 'The court surface is top-notch for professional games.', author: 'Asamoah Gyan' }
    ]
  },
  // Adding a court near the testing location
  {
    location: { type: "Point", coordinates: [0.001888045176285881, 5.739430413320159] }, // Testing location
    picturesUrls: [
      'https://example.com/test-court1.jpg',
      'https://example.com/test-court2.jpg'
    ],
    reviews: [
      { text: 'Newly built court with excellent facilities.', author: 'Test User' },
      { text: 'Great for both day and night games.', author: 'Another Test User' }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
    await Court.createIndexes({ 'location': '2dsphere' });
    console.log('2dsphere index created on location field.');
    await Court.deleteMany({});
    console.log('Existing data cleared.');
    await Court.insertMany(courts);
    console.log('Database seeded with basketball court data!');
  } catch (err) {
    console.error('Error seeding database:', err.message);
    console.error(err.stack);
  } finally {
    mongoose.connection.close().then(() => console.log('MongoDB connection closed after seeding.'))
      .catch(err => {
        console.error('Error closing MongoDB connection:', err.message);
        console.error(err.stack);
      });
  }
};

seedDB();