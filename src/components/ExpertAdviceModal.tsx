// src/components/ExpertAdviceModal.tsx

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface Advice {
  _id: string;
  expertId: string;
  expertName: string;
  content: string;
  createdAt: string;
}

interface ExpertAdviceModalProps {
  postId: string;
  username: string;
  title: string;
  description: string;
  onClose: () => void;
}

const ExpertAdviceModal: React.FC<ExpertAdviceModalProps> = ({
  postId,
  username,
  title,
  description,
  onClose,
}) => {
  const { user } = useUser();
  const [advices, setAdvices] = useState<Advice[]>([]);
  const [newAdvice, setNewAdvice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdvices = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/advices`);
      if (response.ok) {
        const data = await response.json();
        setAdvices(data);
      } else {
        console.error("Failed to fetch advices");
      }
    } catch (error) {
      console.error("Error fetching advices:", error);
    }
  };

  const handleAddAdvice = async () => {
    if (!newAdvice.trim()) return;
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/posts/${postId}/advices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newAdvice }),
      });
      if (response.ok) {
        setNewAdvice("");
        fetchAdvices(); // Refresh advices
      } else {
        console.error("Failed to add advice");
      }
    } catch (error) {
      console.error("Error adding advice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAdvices();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl relative animate-slide-in">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={onClose}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Header Section */}
        <div className="border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
          <p className="text-xs text-gray-500 mt-1 italic">
            Posted by <span className="font-medium">{username}</span>
          </p>
        </div>

        {/* Advice Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Expert Advices</h3>
          {advices.length > 0 ? (
            <div className="space-y-4">
              {advices.map((advice) => (
                <div
                  key={advice._id}
                  className="bg-gray-50 border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-gray-800 font-medium flex items-center">
                      {advice.expertName}
                      <CheckCircleIcon
                        className="w-5 h-5 text-green-500 ml-2"
                        aria-label="Verified Expert"
                      />
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{advice.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(advice.createdAt).toLocaleDateString()} •{" "}
                    {new Date(advice.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No advices yet. Be the first expert to contribute!</p>
          )}
        </div>

        {/* Add Advice Section (Only for Experts) */}
        {user?.publicMetadata?.role === "expert" && (
          <div className="bg-gray-100 rounded-lg p-4 border-t">
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="Add your advice..."
              value={newAdvice}
              onChange={(e) => setNewAdvice(e.target.value)}
            />
            <div className="mt-3 flex justify-end">
              <button
                className={`px-5 py-2 rounded-md shadow-md ${
                  isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500 text-white"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                onClick={handleAddAdvice}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Advice"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertAdviceModal;
