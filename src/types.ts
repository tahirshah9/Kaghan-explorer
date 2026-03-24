export interface Destination {
  id: string;
  name: string;
  description: string;
  photo: string;
  bestTime: string;
  distance: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  category: string;
  featured?: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  photos: string[];
  amenities: string[];
}

export interface TourPackage {
  id: string;
  title: string;
  duration: string;
  price: number;
  itinerary: string[];
  includes: string[];
  excludes: string[];
  groupSize: string;
  image: string;
  whatsappNumber?: string;
  featured?: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}

export interface BookingInquiry {
  id: string;
  name: string;
  email: string;
  destination: string;
  dates: string;
  guests: number;
  createdAt: any;
}
