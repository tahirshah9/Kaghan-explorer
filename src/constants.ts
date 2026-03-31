import { Destination, Hotel, TourPackage } from "./types";

export const DESTINATIONS: Destination[] = [
  {
    id: 'naran',
    name: 'Naran',
    description: 'The main hub of Kaghan Valley, famous for its vibrant markets and base for Saiful Muluk.',
    photo: 'https://images.unsplash.com/photo-1627662236973-4f80bd68a6c7?auto=format&fit=crop&w=800&q=80',
    bestTime: 'May - September',
    distance: '0 km (Main City)',
    difficulty: 'Easy',
    category: 'Towns',
    featured: true
  },
  {
    id: 'saiful-muluk',
    name: 'Saiful Muluk Lake',
    description: 'A legendary lake surrounded by snow-capped peaks, known for the fairy tale of Prince Saiful Muluk.',
    photo: 'https://images.unsplash.com/photo-1581403503643-4355938f361a?auto=format&fit=crop&w=800&q=80',
    bestTime: 'June - August',
    distance: '9 km from Naran',
    difficulty: 'Moderate',
    category: 'Lakes',
    featured: true
  },
  {
    id: 'babusar-top',
    name: 'Babusar Top',
    description: 'The highest point in Kaghan Valley, offering panoramic views of the Himalayas and Karakoram.',
    photo: 'https://images.unsplash.com/photo-1624008915317-cb3ad69b16ad?auto=format&fit=crop&w=800&q=80',
    bestTime: 'July - September',
    distance: '70 km from Naran',
    difficulty: 'Easy',
    category: 'Mountains',
    featured: true
  },
  {
    id: 'shogran',
    name: 'Shogran',
    description: 'A lush green plateau with stunning views of Siri Paye and Makra Peak.',
    photo: 'https://images.unsplash.com/photo-1622312675544-77353907725a?auto=format&fit=crop&w=800&q=80',
    bestTime: 'May - October',
    distance: '30 km from Balakot',
    difficulty: 'Easy',
    category: 'Meadows',
    featured: true
  },
  {
    id: 'lulusar-lake',
    name: 'Lulusar Lake',
    description: 'The largest lake in the valley, reflecting the surrounding mountains like a mirror.',
    photo: 'https://images.unsplash.com/photo-1581403503643-4355938f361a?auto=format&fit=crop&w=800&q=80',
    bestTime: 'June - September',
    distance: '50 km from Naran',
    difficulty: 'Easy',
    category: 'Lakes',
    featured: true
  },
  {
    id: 'siri-paye',
    name: 'Siri Paye Meadows',
    description: 'High altitude meadows above Shogran, famous for their lush greenery and clouds.',
    photo: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    bestTime: 'June - August',
    distance: '6 km from Shogran',
    difficulty: 'Moderate',
    category: 'Meadows',
    featured: true
  },
  {
    id: 'lalazar',
    name: 'Lalazar',
    description: 'A beautiful meadow filled with wild flowers and pine forests.',
    photo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    bestTime: 'July - August',
    distance: '21 km from Naran',
    difficulty: 'Easy',
    category: 'Meadows'
  },
  {
    id: 'dudipatsar',
    name: 'Dudipatsar Lake',
    description: 'Known as the Queen of Lakes, this turquoise gem requires a trek through stunning valleys.',
    photo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    bestTime: 'July - August',
    distance: '15 km trek from Besal',
    difficulty: 'Hard',
    category: 'Lakes'
  }
];

export const HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Pine Park Hotel',
    location: 'Shogran',
    price: 15000,
    rating: 4.5,
    photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
    amenities: ['WiFi', 'Parking', 'Restaurant', 'Garden']
  },
  {
    id: '2',
    name: 'Arcadian Sprucewoods',
    location: 'Shogran',
    price: 22000,
    rating: 4.8,
    photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Luxury Rooms', 'Heating', 'Fine Dining', 'View']
  },
  {
    id: '3',
    name: 'Hotel One Naran',
    location: 'Naran',
    price: 12000,
    rating: 4.2,
    photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'],
    amenities: ['WiFi', 'Room Service', 'Parking']
  },
  {
    id: '4',
    name: 'Millennium Inn',
    location: 'Naran',
    price: 18000,
    rating: 4.6,
    photos: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Luxury Suites', 'Restaurant', 'WiFi']
  }
];

export const PACKAGES: TourPackage[] = [
  {
    id: '3-day',
    title: '3-Day Naran Escape',
    duration: '3 Days / 2 Nights',
    price: 45000,
    itinerary: ['Day 1: Arrival in Naran', 'Day 2: Saiful Muluk & Babusar Top', 'Day 3: Departure'],
    includes: ['Transport', 'Hotel', 'Breakfast'],
    excludes: ['Lunch', 'Dinner', 'Tickets'],
    groupSize: '2-4 People',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    whatsappNumber: '923000000000',
    featured: true
  },
  {
    id: '5-day-luxury',
    title: '5-Day Luxury Kaghan Tour',
    duration: '5 Days / 4 Nights',
    price: 85000,
    itinerary: ['Day 1: Islamabad to Shogran', 'Day 2: Siri Paye Exploration', 'Day 3: Naran & Saiful Muluk', 'Day 4: Babusar Top & Lulusar', 'Day 5: Return to Islamabad'],
    includes: ['Luxury SUV', 'Premium Hotels', 'All Meals', 'Guide'],
    excludes: ['Personal Expenses', 'Tips'],
    groupSize: '2-3 People',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    whatsappNumber: '923000000000',
    featured: true
  },
  {
    id: 'adventure-trek',
    title: 'Dudipatsar Adventure Trek',
    duration: '4 Days / 3 Nights',
    price: 35000,
    itinerary: ['Day 1: Naran to Besal', 'Day 2: Trek to Dudipatsar', 'Day 3: Lake Exploration', 'Day 4: Return Trek'],
    includes: ['Camping Gear', 'Meals', 'Porters', 'Guide'],
    excludes: ['Sleeping Bags', 'Personal Gear'],
    groupSize: '5-10 People',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    whatsappNumber: '923000000000',
    featured: true
  }
];
