"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { motion } from "framer-motion";

export default function NewPost() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    if (!user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    // Create FormData and append necessary fields
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("username", user.username || user.firstName || "Anonymous");
    formData.append("title", title);
    formData.append("description", description);

    // Add the image file if available
    if (image) {
      formData.append("file", image);
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData, // Send FormData
      });

      if (response.ok) {
        alert("Post created successfully!");
        setTitle("");
        setDescription("");
        setImage(null);
        setPreview(null);
      } else {
        const errorData = await response.json();
        alert(`Failed to create post: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <motion.div
      className="relative p-6 min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-start"
      style={{
        backgroundImage: "url('/new-post-background.jpg')",
        backgroundColor: "rgba(255, 255, 255, 0.7)", // Light overlay for better readability
        backgroundBlendMode: "overlay", // Blend the image with the overlay
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Content */}
      <div className="relative w-full max-w-3xl bg-white bg-opacity-80 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
          আপনার প্রশ্ন জিজ্ঞাসা করুন
        </h1>
        <p className="text-gray-600 text-sm md:text-base mb-8">
          কমিউনিটিতে আপনার চিন্তা, সমস্যা বা প্রশ্ন শেয়ার করুন।
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            শিরোনাম
          </label>
          <input
            type="text"
            placeholder="যেমন: ফ্রেমওয়ার্ক Y-তে সমস্যা X কীভাবে ঠিক করব?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">বিবরণ</label>
          <textarea
            placeholder="আপনার প্রশ্ন বা সমস্যার বিস্তারিত বর্ণনা প্রদান করুন।"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            ছবি আপলোড করুন (ঐচ্ছিক)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="প্রিভিউ"
                className="max-h-60 rounded-md border"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-800 text-white py-3 rounded font-semibold hover:bg-green-700 transition"
        >
          আপনার প্রশ্ন জমা দিন
        </button>
      </div>
    </motion.div>
  );
}
