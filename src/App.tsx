/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import Hotels from "./pages/Hotels";
import Packages from "./pages/Packages";
import Guide from "./pages/Guide";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Partner from "./pages/Partner";
import { MessageSquare } from "lucide-react";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="packages" element={<Packages />} />
          <Route path="guide" element={<Guide />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="partner" element={<Partner />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-bold whitespace-nowrap">
          Chat with us
        </span>
      </a>
    </Router>
  );
}

