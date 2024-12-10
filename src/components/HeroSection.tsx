"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type HeroSectionProps = {
  onExploreClick: () => void;
};

const HeroSection = ({ onExploreClick }: HeroSectionProps) => {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const textVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut", delay: 0.5 },
    },
    hover: {
      scale: 1.1,
      backgroundColor: "#d9f99d",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/HeroVideo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Fade effect at top and bottom */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black via-transparent to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>

      {/* Overlay to darken the video for better text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>

      {/* Animated Content on top of video */}
      <motion.div
        className="relative flex flex-col items-start justify-center h-full text-left z-20 pl-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title with two lines */}
        <motion.h1
          className="text-6xl font-sans-semibold text-white drop-shadow-lg glow-effect"
          variants={textVariants}
        >
          Nurturing Agriculture
          <br />
          with Intelligent Solutions
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mt-4 text-2xl font-medium text-white drop-shadow-md"
          variants={textVariants}
        >
          Preserving the legacy of traditional farming while introducing
          AI-powered innovations.
        </motion.p>

        {/* Description */}
        <motion.p
          className="mt-2 text-lg font-light text-white drop-shadow-sm max-w-xl "
          variants={textVariants}
        >
          Our platform delivers precise recommendations, enabling farmers to
          boost productivity, optimize resources, and embrace a sustainable
          future.
        </motion.p>

        {/* Buttons */}
        <div className="flex gap-6 mt-6">
          <motion.button
            className="px-8 py-4 text-lg font-semibold bg-amber-300 rounded-full shadow-lg transition-all  hover:bg-green-950 hover:scale-105"
            variants={buttonVariants}
            whileHover="hover"
            onClick={() => router.push("/sign-up")}
          >
            Join Now
          </motion.button>
          <motion.button
            className="px-8 py-4 text-lg font-semibold bg-white rounded-full shadow-lg transition-all  hover:bg-green-950 hover:scale-105"
            variants={buttonVariants}
            whileHover="hover"
            onClick={onExploreClick}
            
          >
            Explore Features
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
