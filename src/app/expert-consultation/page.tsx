"use client";
import PostList from "@/components/PostList";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ExpertConsultation() {
  const router = useRouter();
  return (
    <motion.div
      className="p-6 bg-gradient-to-br from-green-100 via-white to-blue-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header Section */}
      <motion.div
        className="text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* You can add header text here if needed */}
      </motion.div>

      {/* Create Post Button (Repositioned) */}
      <motion.div
        className="flex justify-end mb-6"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button
          className="bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg font-medium hover:bg-green-600 transition-transform transform hover:scale-105"
          onClick={() => router.push("/expert-consultation/new-post")}
        >
          পোস্ট করুন
        </motion.button>
      </motion.div>

      {/* Post List Section */}
      <motion.div
        className="bg-white shadow-lg rounded-xl p-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <PostList />
      </motion.div>
    </motion.div>
  );
}
