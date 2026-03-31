import { useState } from "react";
import { TourPackage } from "../types";
import { Clock, Users, CheckCircle2, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import BookingModal from "./BookingModal";

export default function PackageCard({ pkg }: { pkg: TourPackage }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in the "${pkg.title}" package (${pkg.duration}) priced at Rs. ${pkg.price.toLocaleString()}. Can you provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${pkg.whatsappNumber || "923000000000"}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-emerald-950 rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/50 group"
      >
        <div className="relative h-72 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-3xl font-bold text-white mb-2">{pkg.title}</h3>
            <div className="flex items-center space-x-4 text-amber-400 font-medium">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{pkg.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{pkg.groupSize}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <h4 className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest">Itinerary Highlights</h4>
            <ul className="space-y-2">
              {pkg.itinerary.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-start space-x-3 text-emerald-100/80 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-emerald-900">
            <div>
              <p className="text-emerald-100/40 text-xs uppercase font-bold">Starting from</p>
              <span className="text-3xl font-bold text-white">Rs. {pkg.price.toLocaleString()}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-amber-400 text-emerald-950 font-bold px-6 py-3 rounded-2xl hover:bg-amber-300 transition-all hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center space-x-2"
              >
                <span>Book Now</span>
              </button>
              <button 
                onClick={handleWhatsApp}
                className="text-emerald-100/60 text-[10px] uppercase font-bold hover:text-white transition-colors flex items-center justify-center space-x-1"
              >
                <MessageCircle className="h-3 w-3" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <BookingModal 
        pkg={pkg} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
}
