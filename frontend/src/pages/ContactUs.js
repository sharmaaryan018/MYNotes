import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; // For animation

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate an API call
    setTimeout(() => {
      toast.success("Your message has been sent!");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-black text-white w-full h-full pt-20 px-6">
      <h1 className="text-center text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        {/* Left Column - Contact Details */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-bold text-blue-400 mb-4">Get in Touch</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaPhoneAlt className="text-blue-400" />
              <span>+1 (234) 567-890</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-blue-400" />
              <span>support@example.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-blue-400" />
              <span>123 Main Street, City, Country</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Contact Form */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-bold text-blue-400 mb-4">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="4"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold focus:outline-none ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>


    </div>
  );
};

export default ContactUs;
