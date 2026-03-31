import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      if (!db) throw new Error("Database not initialized");
      
      // Save to Firestore for record keeping
      await addDoc(collection(db, "inquiries"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      // Send email via backend API
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // We don't block the user if only the email fails, as the inquiry is saved in DB
      }
      
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error saving inquiry:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-emerald-950 tracking-tight">Get in Touch</h1>
        <p className="text-emerald-800/60 text-lg">Have questions about your trip? Our team is here to help you plan the perfect Kaghan Valley experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Phone, title: "Call Us", info: "+92 300 1234567", sub: "Mon-Sat, 9am-6pm" },
              { icon: Mail, title: "Email Us", info: "info@kaghanexplorer.com", sub: "24/7 Support" },
              { icon: MapPin, title: "Visit Us", info: "Naran Main Bazar", sub: "Kaghan Valley, Pakistan" },
              { icon: MessageSquare, title: "WhatsApp", info: "+92 300 1234567", sub: "Instant Reply" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
                <div className="h-12 w-12 bg-amber-400/20 rounded-2xl flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950">{item.title}</h3>
                  <p className="text-emerald-900 font-medium">{item.info}</p>
                  <p className="text-xs text-emerald-800/40 uppercase font-bold tracking-wider mt-1">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map Embed */}
          <div className="rounded-[3rem] overflow-hidden h-96 shadow-2xl border-8 border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105243.32836481716!2d73.5851486300465!3d34.90885233630653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e649e000000001%3A0x6d9f8e4e00000000!2sNaran%2C%20Mansehra%2C%20Khyber%20Pakhtunkhwa!5e0!3m2!1sen!2s!4v1711190000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-emerald-100 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-emerald-950">Send a Message</h2>
            <p className="text-emerald-800/60">We'll get back to you within 24 hours.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-emerald-950 ml-1">Full Name</label>
                <input
                  {...register("name")}
                  className={`w-full bg-emerald-50/50 border ${errors.name ? 'border-red-400' : 'border-emerald-100'} rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-400 transition-colors`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-emerald-950 ml-1">Email Address</label>
                <input
                  {...register("email")}
                  className={`w-full bg-emerald-50/50 border ${errors.email ? 'border-red-400' : 'border-emerald-100'} rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-400 transition-colors`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-950 ml-1">Subject</label>
              <input
                {...register("subject")}
                className={`w-full bg-emerald-50/50 border ${errors.subject ? 'border-red-400' : 'border-emerald-100'} rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-400 transition-colors`}
                placeholder="How can we help?"
              />
              {errors.subject && <p className="text-xs text-red-500 ml-1">{errors.subject.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-950 ml-1">Message</label>
              <textarea
                {...register("message")}
                rows={5}
                className={`w-full bg-emerald-50/50 border ${errors.message ? 'border-red-400' : 'border-emerald-100'} rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-400 transition-colors resize-none`}
                placeholder="Tell us more about your trip..."
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
                  <span>Send Message</span>
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
