import { useState, useEffect } from "react";
import { auth, db, signInWithGoogle } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, limit, addDoc, getDocs } from "firebase/firestore";
import { LayoutDashboard, Users, MapPin, Hotel, Package, MessageSquare, LogOut, Mail, Database } from "lucide-react";
import { DESTINATIONS, HOTELS, PACKAGES } from "../constants";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Sign-in error:", err);
      if (err.code === "auth/popup-blocked") {
        setError("The sign-in popup was blocked by your browser. Please allow popups for this site.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized for sign-in. Please add your Vercel URL to the 'Authorized Domains' in Firebase Console.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Google sign-in is not enabled in your Firebase project. Please enable it in the Firebase Console.");
      } else {
        setError(err.message || "An unexpected error occurred during sign-in.");
      }
    }
  };

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !user || user.email !== "shahtah5572345@gmail.com") return;

    const qInquiries = query(collection(db, "inquiries"), orderBy("createdAt", "desc"), limit(50));
    const unsubInquiries = onSnapshot(qInquiries, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qSubs = query(collection(db, "newsletter"), orderBy("subscribedAt", "desc"), limit(50));
    const unsubSubs = onSnapshot(qSubs, (snapshot) => {
      setSubscribers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubDests = onSnapshot(collection(db, "destinations"), (snapshot) => {
      setDestinations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubHotels = onSnapshot(collection(db, "hotels"), (snapshot) => {
      setHotels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubPkgs = onSnapshot(collection(db, "packages"), (snapshot) => {
      setPackages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubInquiries();
      unsubSubs();
      unsubDests();
      unsubHotels();
      unsubPkgs();
    };
  }, [user]);

  const isAdmin = user?.email === "shahtah5572345@gmail.com";

  const seedData = async () => {
    if (!db || !isAdmin) return;
    setSeeding(true);
    try {
      // Seed Destinations
      const destSnap = await getDocs(collection(db, "destinations"));
      if (destSnap.empty) {
        for (const dest of DESTINATIONS) {
          await addDoc(collection(db, "destinations"), dest);
        }
      }

      // Seed Hotels
      const hotelSnap = await getDocs(collection(db, "hotels"));
      if (hotelSnap.empty) {
        for (const hotel of HOTELS) {
          await addDoc(collection(db, "hotels"), hotel);
        }
      }

      // Seed Packages
      const pkgSnap = await getDocs(collection(db, "packages"));
      if (pkgSnap.empty) {
        for (const pkg of PACKAGES) {
          await addDoc(collection(db, "packages"), pkg);
        }
      }

      alert("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("Error seeding data. Check console.");
    } finally {
      setSeeding(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !isAdmin) return;
    try {
      const collectionName = activeTab;
      await addDoc(collection(db, collectionName), {
        ...formData,
        createdAt: new Date()
      });
      setShowAddForm(false);
      setFormData({});
      alert(`${activeTab} added successfully!`);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item.");
    }
  };

  const deleteItem = async (id: string) => {
    if (!db || !isAdmin || !window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const { deleteDoc, doc } = await import("firebase/firestore");
      await deleteDoc(doc(db, activeTab, id));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user || !isAdmin) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-8 bg-emerald-50">
        <h1 className="text-4xl font-bold text-emerald-950">Admin Panel</h1>
        <p className="text-emerald-800/60">Please sign in with an admin account to continue.</p>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium max-w-md text-center">
            {error}
          </div>
        )}
        <button
          onClick={handleSignIn}
          className="bg-emerald-950 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-900 transition-all"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-white p-8 space-y-12">
        <h2 className="text-2xl font-bold tracking-tight">Admin<span className="text-amber-400">Panel</span></h2>
        <nav className="space-y-4">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "inquiries", icon: MessageSquare, label: "Inquiries" },
            { id: "subscribers", icon: Mail, label: "Subscribers" },
            { id: "destinations", icon: MapPin, label: "Destinations" },
            { id: "hotels", icon: Hotel, label: "Hotels" },
            { id: "packages", icon: Package, label: "Packages" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? "bg-amber-400 text-emerald-950 font-bold" : "text-emerald-100/60 hover:bg-white/5"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={() => auth?.signOut()}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 space-y-8 overflow-y-auto">
        <header className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-4xl font-bold text-emerald-950 capitalize">{activeTab}</h1>
            {isAdmin && activeTab === "dashboard" && (
              <button
                onClick={seedData}
                disabled={seeding}
                className="flex items-center space-x-2 bg-emerald-100 text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-200 transition-all disabled:opacity-50"
              >
                <Database className="h-4 w-4" />
                <span>{seeding ? "Seeding..." : "Seed Initial Data"}</span>
              </button>
            )}
            {isAdmin && ["destinations", "hotels", "packages"].includes(activeTab) && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-amber-400 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-300 transition-all"
              >
                <span>+ Add New {activeTab.slice(0, -1)}</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-emerald-800/60">{user.email}</span>
            <div className="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center font-bold text-emerald-950">
              {user.displayName?.[0] || "A"}
            </div>
          </div>
        </header>

        <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-emerald-100 min-h-[600px]">
          {activeTab === "dashboard" && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: "Total Inquiries", value: inquiries.length.toString(), color: "bg-blue-50 text-blue-600" },
                  { label: "Subscribers", value: subscribers.length.toString(), color: "bg-amber-50 text-amber-600" },
                  { label: "Total Revenue", value: "Rs. 1.2M", color: "bg-emerald-50 text-emerald-600" },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.color} p-8 rounded-3xl space-y-2`}>
                    <p className="text-sm font-bold uppercase tracking-wider opacity-60">{stat.label}</p>
                    <p className="text-4xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-emerald-950">Recent Inquiries</h3>
                <div className="border border-emerald-50 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-emerald-50 text-emerald-900 text-sm uppercase font-bold">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50">
                      {inquiries.slice(0, 5).map((inq) => (
                        <tr key={inq.id} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="px-6 py-4 text-emerald-950 font-medium">{inq.name}</td>
                          <td className="px-6 py-4 text-emerald-800/60">{inq.subject}</td>
                          <td className="px-6 py-4 text-emerald-800/60">
                            {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : "Just now"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "inquiries" && (
            <div className="space-y-6">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-6 border border-emerald-50 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-emerald-950">{inq.subject}</h4>
                    <span className="text-xs text-emerald-800/40">
                      {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleString() : "Just now"}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-900 font-medium">{inq.name} ({inq.email})</p>
                  <p className="text-emerald-800/60">{inq.message}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "subscribers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscribers.map((sub) => (
                <div key={sub.id} className="p-4 bg-emerald-50 rounded-xl flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-emerald-950" />
                  <div>
                    <p className="font-bold text-emerald-950 text-sm">{sub.email}</p>
                    <p className="text-[10px] text-emerald-800/40 uppercase">
                      {sub.subscribedAt?.toDate ? sub.subscribedAt.toDate().toLocaleDateString() : "Just now"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {["destinations", "hotels", "packages"].includes(activeTab) && (
            <div className="space-y-8">
              {showAddForm && (
                <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 space-y-6">
                  <h3 className="text-xl font-bold text-emerald-950">Add New {activeTab.slice(0, -1)}</h3>
                  <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeTab === "destinations" && (
                      <>
                        <input type="text" placeholder="Name" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, name: e.target.value})} required />
                        <input type="text" placeholder="Category" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, category: e.target.value})} required />
                        <input type="text" placeholder="Photo URL" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, photo: e.target.value})} required />
                        <input type="text" placeholder="Best Time" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, bestTime: e.target.value})} required />
                        <input type="text" placeholder="Distance" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, distance: e.target.value})} required />
                        <input type="text" placeholder="Difficulty" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, difficulty: e.target.value})} required />
                        <textarea placeholder="Description" className="p-3 rounded-xl border border-emerald-200 md:col-span-2" onChange={e => setFormData({...formData, description: e.target.value})} required />
                      </>
                    )}
                    {activeTab === "hotels" && (
                      <>
                        <input type="text" placeholder="Hotel Name" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, name: e.target.value})} required />
                        <input type="text" placeholder="Location" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, location: e.target.value})} required />
                        <input type="number" placeholder="Price per night" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                        <input type="number" step="0.1" placeholder="Rating (1-5)" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, rating: Number(e.target.value)})} required />
                        <input type="text" placeholder="Photo URL" className="p-3 rounded-xl border border-emerald-200 md:col-span-2" onChange={e => setFormData({...formData, photos: [e.target.value]})} required />
                        <input type="text" placeholder="Amenities (comma separated)" className="p-3 rounded-xl border border-emerald-200 md:col-span-2" onChange={e => setFormData({...formData, amenities: e.target.value.split(",")})} required />
                      </>
                    )}
                    {activeTab === "packages" && (
                      <>
                        <input type="text" placeholder="Package Title" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, title: e.target.value})} required />
                        <input type="text" placeholder="Duration" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, duration: e.target.value})} required />
                        <input type="number" placeholder="Price" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                        <input type="text" placeholder="Group Size" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, groupSize: e.target.value})} required />
                        <input type="text" placeholder="WhatsApp Number (e.g. 923001234567)" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} required />
                        <input type="text" placeholder="Image URL" className="p-3 rounded-xl border border-emerald-200" onChange={e => setFormData({...formData, image: e.target.value})} required />
                        <textarea placeholder="Itinerary (comma separated)" className="p-3 rounded-xl border border-emerald-200 md:col-span-2" onChange={e => setFormData({...formData, itinerary: e.target.value.split(",")})} required />
                      </>
                    )}
                    <div className="md:col-span-2 flex space-x-4">
                      <button type="submit" className="bg-emerald-950 text-white px-8 py-3 rounded-xl font-bold">Save Item</button>
                      <button type="button" onClick={() => setShowAddForm(false)} className="bg-white text-emerald-950 px-8 py-3 rounded-xl font-bold border border-emerald-200">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === "destinations" ? destinations : activeTab === "hotels" ? hotels : packages).map((item) => (
                  <div key={item.id} className="bg-emerald-50 rounded-2xl p-6 space-y-4 relative group">
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                    <img src={item.photo || item.photos?.[0] || item.image} alt="" className="w-full h-32 object-cover rounded-xl" />
                    <h4 className="font-bold text-emerald-950">{item.name || item.title}</h4>
                    <p className="text-xs text-emerald-800/60 line-clamp-2">{item.description || item.location || item.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

