import { Handshake, TrendingUp, Users, ShieldCheck, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { motion } from "motion/react";

const partnerSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  businessType: z.enum(["Hotel", "Tour Agency", "Transport Provider", "Local Guide", "Other"]),
  message: z.string().min(20, "Please provide more details about your business"),
});

type PartnerForm = z.infer<typeof partnerSchema>;

export default function Partner() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PartnerForm>({
    resolver: zodResolver(partnerSchema),
  });

  const onSubmit = async (data: PartnerForm) => {
    try {
      if (!db) throw new Error("Database not initialized");
      
      await addDoc(collection(db, "partnerships"), {
        ...data,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error saving partnership request:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80" 
            alt="Partnership" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Grow Your Business <br />
            <span className="text-amber-400">With Us</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-100/80 text-xl max-w-2xl mx-auto"
          >
            Join the Kaghan Explorer network and reach thousands of travelers looking for premium experiences in the valley.
          </motion.p>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: TrendingUp, title: "Increased Revenue", desc: "Get more bookings through our high-traffic platform." },
            { icon: Users, title: "Wider Audience", desc: "Reach domestic and international tourists effortlessly." },
            { icon: ShieldCheck, title: "Verified Partners", desc: "Build trust with our 'Kaghan Explorer Verified' badge." },
            { icon: Handshake, title: "Dedicated Support", desc: "Get a dedicated account manager for your business." },
          ].map((benefit, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-emerald-100 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-amber-400/20 rounded-2xl flex items-center justify-center">
                <benefit.icon className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-emerald-950 text-lg">{benefit.title}</h3>
              <p className="text-emerald-800/60 text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-emerald-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12 lg:p-20 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-emerald-950">Partner Application</h2>
              <p className="text-emerald-800/60">Fill out the form below and our partnership team will contact you within 48 hours to discuss the next steps.</p>
            </div>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-4"
              >
                <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-950">Application Received!</h3>
                <p className="text-emerald-800/60">Thank you for your interest. We'll be in touch soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-950 ml-1">Business Name</label>
                    <input
                      {...register("businessName")}
                      className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="e.g. Pine View Hotel"
                    />
                    {errors.businessName && <p className="text-xs text-red-500 ml-1">{errors.businessName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-950 ml-1">Contact Person</label>
                    <input
                      {...register("contactPerson")}
                      className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="Your Name"
                    />
                    {errors.contactPerson && <p className="text-xs text-red-500 ml-1">{errors.contactPerson.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-950 ml-1">Email Address</label>
                    <input
                      {...register("email")}
                      className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="info@business.com"
                    />
                    {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-950 ml-1">Phone Number</label>
                    <input
                      {...register("phone")}
                      className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="+92 300 1234567"
                    />
                    {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-950 ml-1">Business Type</label>
                  <select
                    {...register("businessType")}
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-400 transition-colors appearance-none"
                  >
                    <option value="Hotel">Hotel / Resort</option>
                    <option value="Tour Agency">Tour Agency</option>
                    <option value="Transport Provider">Transport Provider</option>
                    <option value="Local Guide">Local Guide</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-950 ml-1">Tell us about your business</label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    placeholder="Describe your services and why you want to partner with us..."
                  />
                  {errors.message && <p className="text-xs text-red-500 ml-1">{errors.message.message}</p>}
                </div>

                <button
                  disabled={isSubmitting}
                  className="w-full bg-emerald-950 text-white font-bold py-5 rounded-2xl hover:bg-emerald-900 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          <div className="hidden lg:block bg-emerald-50 p-20 space-y-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-emerald-950">Our Partnership Model</h3>
              <ul className="space-y-6">
                {[
                  { title: "Commission Based", desc: "Pay only when you get a booking through our platform." },
                  { title: "Featured Listings", desc: "Get top placement in search results and homepage." },
                  { title: "Direct Integration", desc: "Connect your booking system directly with our API." },
                ].map((item, i) => (
                  <li key={i} className="flex space-x-4">
                    <div className="h-6 w-6 rounded-full bg-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-emerald-950">{item.title}</p>
                      <p className="text-sm text-emerald-800/60">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 bg-white rounded-3xl border border-emerald-100 space-y-4">
              <p className="text-sm italic text-emerald-800/60">"Kaghan Explorer helped us increase our occupancy by 40% during the peak season. Their platform is easy to use and the support is fantastic."</p>
              <p className="font-bold text-emerald-950">— Manager, Pine Park Hotel</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
