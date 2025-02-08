import React from 'react';
import { FaReact, FaNodeJs, FaDatabase, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-black text-white w-full min-h-screen pt-20 px-6">
      <h1 className="text-center text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
        About Us
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center text-xl text-gray-300 mb-8"
      >
        <p>
          We are a passionate team dedicated to providing a seamless and effective learning experience. Our platform connects educators and students with easily accessible resources and tools to help them thrive.
        </p>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center shadow-lg transition-transform transform hover:scale-105">
          <FaUsers className="text-4xl mb-4 text-blue-500" />
          <h3 className="text-xl font-bold text-blue-400">Our Mission</h3>
          <p className="text-gray-400 mt-2">
            To make education more accessible and engaging for everyone.
          </p>
        </div>
        <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center shadow-lg transition-transform transform hover:scale-105">
          <FaReact className="text-4xl mb-4 text-blue-500" />
          <h3 className="text-xl font-bold text-blue-400">Frontend Development</h3>
          <p className="text-gray-400 mt-2">
            Built using React, we ensure a dynamic and responsive user experience.
          </p>
        </div>
        <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center shadow-lg transition-transform transform hover:scale-105">
          <FaNodeJs className="text-4xl mb-4 text-green-500" />
          <h3 className="text-xl font-bold text-blue-400">Backend Development</h3>
          <p className="text-gray-400 mt-2">
            Powered by Node.js and Express, ensuring smooth communication and performance.
          </p>
        </div>
        <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center shadow-lg transition-transform transform hover:scale-105">
          <FaDatabase className="text-4xl mb-4 text-orange-500" />
          <h3 className="text-xl font-bold text-blue-400">Database Management</h3>
          <p className="text-gray-400 mt-2">
            Using MongoDB to manage large datasets efficiently and securely.
          </p>
        </div>
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="text-center mt-12"
      >
        <h2 className="text-3xl font-bold text-blue-400 mb-6">
          Our Vision for the Future
        </h2>
        <p className="text-lg text-gray-400">
          Our platform envisions a future where education is inclusive, interactive, and personalized. We aim to provide educators with the tools they need to succeed and help students achieve their fullest potential.
        </p>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="mt-16 text-center"
      >
        <h2 className="text-3xl font-bold text-blue-400 mb-6">
          Contact Us
        </h2>
        <p className="text-lg text-gray-400">
          Have any questions? Feel free to reach out to us through the following channels:
        </p>
        <div className="mt-4 flex justify-center space-x-8">
          <a
            href="mailto:support@studyplatform.com"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Email Us
          </a>
          <a
            href="https://www.linkedin.com/in/studyplatform"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
