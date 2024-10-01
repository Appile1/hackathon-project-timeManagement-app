"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const features = [
  {
    icon: "📚", // Use emoji for icons as placeholders
    title: "Flashcards",
    description: "Create and study flashcards for efficient learning.",
  },
  {
    icon: "🧠", // Use emoji for icons as placeholders
    title: "Memory",
    description: "Improve your memory with engaging exercises.",
  },
  {
    icon: "🖊️", // Use emoji for icons as placeholders
    title: "Notes",
    description: "Take and organize notes with ease.",
  },
  {
    icon: "🏆", // Use emoji for icons as placeholders
    title: "Leaderboard",
    description: "Compete with friends and track your progress.",
  },
  {
    icon: "⏰", // Use emoji for icons as placeholders
    title: "Pomodoro Timer",
    description: "Boost productivity with timed work sessions.",
  },
];

const testimonials = [
  {
    name: "Sarah L.",
    quote: "Productivity Pro has revolutionized my study habits!",
    rating: 5,
  },
  {
    name: "John D.",
    quote: "I've seen a significant boost in my productivity.",
    rating: 4,
  },
  {
    name: "Emily R.",
    quote: "The Pomodoro Timer is a game-changer for me.",
    rating: 5,
  },
];

export default function HomePage() {
  const [isVisible, setIsVisible] = useState({
    features: false,
    testimonials: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const featuresSection = document.getElementById("features");
      const testimonialsSection = document.getElementById("testimonials");

      if (featuresSection) {
        const featureRect = featuresSection.getBoundingClientRect();
        setIsVisible((prev) => ({
          ...prev,
          features: featureRect.top < window.innerHeight,
        }));
      }

      if (testimonialsSection) {
        const testimonialRect = testimonialsSection.getBoundingClientRect();
        setIsVisible((prev) => ({
          ...prev,
          testimonials: testimonialRect.top < window.innerHeight,
        }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Boost Your Productivity with Productivity Pro
            </motion.h1>
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Unlock your potential and achieve more with our all-in-one
              productivity solution.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200">
                Get Started
              </button>
            </motion.div>
          </div>
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >

          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="border rounded-lg p-6 shadow-md">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <a
                      href={`#${feature.title.toLowerCase()}`}
                      className="text-blue-600 hover:underline inline-flex items-center"
                    >
                      Learn More
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-blue-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="border rounded-lg p-6 shadow-md">
                    <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{testimonial.name}</span>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
