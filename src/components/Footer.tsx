import { Link } from "react-router-dom";
import { Mountain, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !db) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        subscribedAt: serverTimestamp(),
      });
      setSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-amber-400" />
              <span className="text-2xl font-bold text-white">
                Kaghan<span className="text-amber-400">Explorer</span>
              </span>
            </Link>
            <p className="text-emerald-100/60 leading-relaxed">
              Discover the breathtaking beauty of Kaghan Valley. We provide premium travel experiences, luxury stays, and unforgettable memories in the heart of the Himalayas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-400 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-amber-400 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-amber-400 transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/destinations" className="hover:text-amber-400 transition-colors">Destinations</Link></li>
              <li><Link to="/hotels" className="hover:text-amber-400 transition-colors">Hotels & Stays</Link></li>
              <li><Link to="/packages" className="hover:text-amber-400 transition-colors">Tour Packages</Link></li>
              <li><Link to="/guide" className="hover:text-amber-400 transition-colors">Travel Guide</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors font-bold text-amber-400">Partner with Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-400" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-400" />
                <span>info@kaghanexplorer.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-amber-400" />
                <span>Naran Main Bazar, Kaghan Valley</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-emerald-100/60 mb-4">Subscribe for travel tips and exclusive deals.</p>
            {subscribed ? (
              <div className="bg-emerald-900/50 border border-emerald-800 rounded-lg px-4 py-3 text-amber-400 text-sm font-bold">
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-emerald-900/50 border border-emerald-800 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button 
                  disabled={loading}
                  className="w-full bg-amber-400 text-emerald-950 font-bold py-2 rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-50"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-emerald-900 text-center text-emerald-100/40 text-sm">
          <p>© {new Date().getFullYear()} Kaghan Explorer. All rights reserved. Designed for Pakistan Tourism.</p>
        </div>
      </div>
    </footer>
  );
}

