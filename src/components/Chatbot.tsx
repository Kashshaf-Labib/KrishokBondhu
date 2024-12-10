"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false); // Modal open/close state
  const [userInput, setUserInput] = useState(""); // User's query
  const [chatLog, setChatLog] = useState<{ sender: string; message: string }[]>([]); // Chat history

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setChatLog((prev) => [...prev, { sender: "user", message: userInput }]);

    try {
      const response = await axios.post("http://localhost:8000/query", {
        query: userInput,
      });
      const botResponse = response.data.content;

      setChatLog((prev) => [...prev, { sender: "bot", message: botResponse }]);
    } catch (error) {
      setChatLog((prev) => [
        ...prev,
        { sender: "bot", message: "Sorry, I couldn't process that. Please try again." },
      ]);
    }

    setUserInput("");
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 z-50"
        onClick={toggleChat}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        💬
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 bg-white w-96 max-w-full h-[500px] rounded-xl shadow-xl z-50 flex flex-col border-2 border-green-500"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-lg font-semibold">🌱 Chat with Us</h2>
              <button
                className="text-white text-2xl font-bold"
                onClick={toggleChat}
                aria-label="Close Chatbot"
              >
                ✕
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {chatLog.length === 0 && (
                <p className="text-center text-gray-500 text-sm">
                  Start a conversation with us! 🌾
                </p>
              )}
              {chatLog.map((entry, index) => (
                <motion.div
                  key={index}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    entry.sender === "user"
                      ? "bg-green-500 text-white ml-auto"
                      : "bg-gray-200 text-gray-900"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="text-sm font-medium">{entry.message}</p>
                </motion.div>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white border-t flex items-center">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm placeholder-gray-400"
                placeholder="Ask me anything..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-5 py-3 rounded-r-lg hover:bg-green-700 transition font-semibold"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;





