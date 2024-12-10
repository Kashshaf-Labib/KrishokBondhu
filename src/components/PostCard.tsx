// src/components/PostCard.tsx
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ExpertAdviceModal from "./ExpertAdviceModal"; // Import the modal component

interface PostCardProps {
  _id: string;
  username: string;
  title: string;
  description: string;
  imageUrl?: string;
  upvotes: number;
  createdAt: Date;
  interestedUsers?: string[];
}

const PostCard: React.FC<PostCardProps> = ({
  _id,
  username,
  title,
  description,
  imageUrl,
  upvotes,
  createdAt,
}) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(upvotes);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleUpvote = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const newUpvotes = isUpvoted ? currentUpvotes - 1 : currentUpvotes + 1;
      const response = await fetch(`/api/posts/${_id}/upvote`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: !isUpvoted }),
      });
      if (response.ok) {
        setIsUpvoted(!isUpvoted);
        setCurrentUpvotes(newUpvotes);
      } else {
        console.error("Failed to update upvote count");
      }
    } catch (error) {
      console.error("Error updating upvote count:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-gray-800">{username}</h2>
            <p className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString()} -{" "}
              {new Date(createdAt).toLocaleTimeString()}
            </p>
          </div>
          <motion.button
            className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full focus:outline-none ${
              isUpvoted
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
            }`}
            onClick={handleUpvote}
            disabled={loading}
          >
            ⬆ {currentUpvotes}
          </motion.button>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Post Image"
            width={500}
            height={300}
            className="rounded-md object-cover w-full max-h-64 mb-4"
          />
        )}

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">#{_id.slice(-5)}</p>
          <button
            className="text-sm text-green-700 hover:underline"
            onClick={() => setIsModalOpen(true)}
          >
            Expert Advice
          </button>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <ExpertAdviceModal
          postId={_id}
          onClose={() => setIsModalOpen(false)}
          username={username}
          title={title}
          description={description}
        />
      )}
    </>
  );
};

export default PostCard;
