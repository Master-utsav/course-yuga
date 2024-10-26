import React from 'react';
import { motion } from 'framer-motion';
import {Image} from "@nextui-org/react"
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen h-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300 lg:py-12 lg:pt-24 relative overflow-x-hidden py-4 pt-40 md:pt-52">
      {/* Background Section */}
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-400/30 via-transparent to-teal-600/20 blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Page Container */}
      <div className="max-w-6xl mx-auto px-6 space-y-12 relative">
        <motion.h1
          className="text-3xl md:text-6xl font-extrabold text-gray-900 dark:text-white text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          About Course-Yuga
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-700 dark:text-gray-300 text-center leading-relaxed max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Course-Yuga is your gateway to mastering new skills and achieving your
          goals. Whether you’re an aspiring professional or a curious learner, we provide the resources you need to
          unlock your potential and embrace lifelong learning.
        </motion.p>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our mission is to empower learners across the globe by offering
              high-quality courses designed by experts. We believe education should
              be accessible to all, and we are committed to building a platform
              that inspires personal and professional growth.
            </p>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            className="rounded-xl shadow-lg object-cover h-64 w-full"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Image
                isBlurred
                src="/images/about_us_pic_1.jpg"
                alt="Our Mission"
                className="rounded-xl shadow-lg object-cover h-64 w-full"
            />
          </motion.div>
        </div>

        {/* Core Values Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Excellence', description: 'Delivering top-quality learning experiences.' },
              { title: 'Accessibility', description: 'Ensuring knowledge is accessible to everyone.' },
              { title: 'Innovation', description: 'Creating future-ready courses for modern learners.' },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.2 }}
              >
                <h3 className="text-2xl font-semibold text-teal-600 dark:text-teal-400 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <Link to="/courses">
            <button className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-700">
                Explore Courses
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
