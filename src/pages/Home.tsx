import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Star, Users, ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";
import { DESTINATIONS as DEFAULT_DESTINATIONS, PACKAGES as DEFAULT_PACKAGES } from "../constants";
import DestinationCard from "../components/DestinationCard";
import PackageCard from "../components/PackageCard";
import { db } from "../firebase";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { Destination, TourPackage } from "../types";

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>(DEFAULT_DESTINATIONS);
  const [packages, setPackages] = useState<TourPackage[]>(DEFAULT_PACKAGES);

  useEffect(() => {
    if (!db) return;
    
    const unsubDests = onSnapshot(collection(db, "destinations"), (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
        const featured = data.filter(d => d.featured);
        setDestinations(featured.length > 0 ? featured : data.slice(0, 6));
      }
    });

    const unsubPkgs = onSnapshot(collection(db, "packages"), (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TourPackage));
        const featured = data.filter(p => p.featured);
        setPackages(featured.length > 0 ? featured : data.slice(0, 3));
      }
    });

    return () => {
      unsubDests();
      unsubPkgs();
    };
  }, []);
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1627662236973-4f80bd68a6c7?auto=format&fit=crop&w=1920&q=80"
            alt="Kaghan Valley"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-emerald-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="inline-block bg-amber-400/20 backdrop-blur-md border border-amber-400/30 text-amber-400 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
              Explore Pakistan
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-tight">
              Discover the <span className="text-amber-400 italic font-serif">Heaven</span> <br /> on Earth
            </h1>
            <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto font-medium">
              Experience the breathtaking landscapes, crystal clear lakes, and majestic mountains of Kaghan Valley.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-2 rounded-3xl border border-white/20 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 flex items-center px-6 py-4 space-x-3 border-b md:border-b-0 md:border-r border-white/10">
                <Search className="h-5 w-5 text-amber-400" />
                <input
                  type="text"
                  placeholder="Where to go?"
                  className="bg-transparent border-none focus:ring-0 text-white placeholder-emerald-100/50 w-full"
                />
              </div>
              <div className="flex-1 flex items-center px-6 py-4 space-x-3">
                <MapPin className="h-5 w-5 text-amber-400" />
                <select className="bg-transparent border-none focus:ring-0 text-white w-full appearance-none">
                  <option className="bg-emerald-950">All Destinations</option>
                  <option className="bg-emerald-950">Naran</option>
                  <option className="bg-emerald-950">Shogran</option>
                  <option className="bg-emerald-950">Babusar Top</option>
                </select>
              </div>
              <button className="w-full md:w-auto bg-amber-400 text-emerald-950 font-bold px-10 py-4 rounded-2xl hover:bg-amber-300 transition-all">
                Search
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-12 text-white/60 text-sm font-bold uppercase tracking-widest">
          <div className="flex flex-col items-center">
            <span className="text-amber-400 text-2xl font-bold">50+</span>
            <span>Destinations</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-amber-400 text-2xl font-bold">100+</span>
            <span>Hotels</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-amber-400 text-2xl font-bold">1k+</span>
            <span>Happy Tourists</span>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-emerald-950 tracking-tight">Featured Destinations</h2>
            <p className="text-emerald-800/60 max-w-xl">Handpicked spots that define the beauty of Kaghan Valley. From alpine lakes to lush meadows.</p>
          </div>
          <Link to="/destinations" className="flex items-center space-x-2 text-emerald-950 font-bold hover:text-amber-600 transition-colors group">
            <span>View All</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.slice(0, 3).map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* Tour Packages */}
      <section className="bg-emerald-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-emerald-950 tracking-tight">Best Value Packages</h2>
            <p className="text-emerald-800/60 max-w-2xl mx-auto">All-inclusive tour packages designed to give you the best experience without any hassle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-emerald-950 rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">What Our Explorers Say About Us</h2>
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
                  <p className="text-emerald-100/80 italic text-lg mb-6">"The trip to Saiful Muluk was magical. Kaghan Explorer handled everything perfectly, from the jeep ride to the hotel stay. Highly recommended!"</p>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-amber-400 flex items-center justify-center font-bold text-emerald-950">AH</div>
                    <div>
                      <h4 className="text-white font-bold">Ahmed Hassan</h4>
                      <p className="text-emerald-100/40 text-sm">Traveler from Lahore</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1581403503643-4355938f361a?auto=format&fit=crop&w=800&q=80"
                  alt="Happy Traveler"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 bg-amber-400 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-emerald-950 fill-emerald-950 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
