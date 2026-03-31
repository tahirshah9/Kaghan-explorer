import { useState } from "react";
import { TourPackage } from "../types";
import { X, Calendar, Users, Phone, Mail, User, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface BookingModalProps {
  pkg: TourPackage;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ pkg, isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    travelDate: "",
    guests: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!db) throw new Error("Database not initialized");
      
      await addDoc(collection(db, "bookings"), {
        ...formData,
        packageId: pkg.id,
        packageTitle: pkg.title,
        totalPrice: pkg.price * formData.guests,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({ userName: "", userEmail: "", userPhone: "", travelDate: "", guests: 1 });
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {isSuccess ? (
              <div className="p-12 text-center space-y-6">
                <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-emerald-950">Booking Received!</h2>
                <p className="text-emerald-800/60">We've received your booking request for <strong>{pkg.title}</strong>. Our team will contact you shortly to confirm the details.</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row h-full">
                {/* Left Side - Info */}
                <div className="md:w-2/5 bg-emerald-950 p-8 text-white space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{pkg.title}</h3>
                    <p className="text-emerald-100/60 text-sm">{pkg.duration}</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-400">What's Included</p>
                    <ul className="space-y-2 text-sm text-emerald-100/80">
                      {pkg.includes.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle2 className="h-3 w-3 text-amber-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-8 border-t border-emerald-900">
                    <p className="text-xs text-emerald-100/40 uppercase font-bold">Total Price</p>
                    <p className="text-3xl font-bold">Rs. {(pkg.price * formData.guests).toLocaleString()}</p>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-3/5 p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-emerald-950">Book Your Trip</h2>
                    <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
                      <X className="h-6 w-6 text-emerald-950" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-emerald-950 uppercase ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-800/40" />
                        <input
                          type="text"
                          required
                          value={formData.userName}
                          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                          className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-emerald-950 uppercase ml-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-800/40" />
                          <input
                            type="email"
                            required
                            value={formData.userEmail}
                            onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                            className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                            placeholder="john@email.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-emerald-950 uppercase ml-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-800/40" />
                          <input
                            type="tel"
                            required
                            value={formData.userPhone}
                            onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                            className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                            placeholder="+92..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-emerald-950 uppercase ml-1">Travel Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-800/40" />
                          <input
                            type="date"
                            required
                            value={formData.travelDate}
                            onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                            className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-emerald-950 uppercase ml-1">Guests</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-800/40" />
                          <input
                            type="number"
                            min="1"
                            required
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                            className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={isSubmitting}
                      className="w-full bg-emerald-950 text-white font-bold py-4 rounded-2xl hover:bg-emerald-900 transition-all disabled:opacity-50 mt-4"
                    >
                      {isSubmitting ? "Processing..." : "Confirm Booking"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
