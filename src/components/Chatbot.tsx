'use client';

import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: string; message: string }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    setChatLog(prev => [...prev, { sender: 'user', message: userInput }]);
    setIsLoading(true);

    try {
      console.log('Sending request to:', `${
        process.env.NEXT_PUBLIC_API_URL ||
        'https://krishok-bondhu-backend-1.onrender.com'
      }/message`);
      
      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          'https://krishok-bondhu-backend-1.onrender.com'
        }/message`,
        {
          message: userInput,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      console.log('Full response object:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);
      console.log('Response data type:', typeof response.data);
      console.log('Response data keys:', Object.keys(response.data || {}));

      // Check if response.data exists and has content
      if (response.data && response.data.content && typeof response.data.content === 'string' && response.data.content.trim() !== '') {
        setChatLog(prev => [
          ...prev,
          {
            sender: 'bot',
            message: response.data.content,
          },
        ]);
      } else {
        console.error('Invalid response format or empty content:', response.data);
        
        // Try to show a helpful error message
        let errorMessage = 'দুঃখিত, সার্ভার থেকে সঠিক উত্তর পাওয়া যায়নি।';
        
        if (!response.data) {
          errorMessage = 'দুঃখিত, সার্ভার থেকে কোন উত্তর পাওয়া যায়নি।';
        } else if (!response.data.content) {
          errorMessage = 'দুঃখিত, সার্ভারের উত্তরে content field নেই।';
        } else if (typeof response.data.content !== 'string') {
          errorMessage = 'দুঃখিত, সার্ভারের উত্তর সঠিক ফরম্যাটে নেই।';
        } else if (response.data.content.trim() === '') {
          errorMessage = 'দুঃখিত, সার্ভার থেকে খালি উত্তর এসেছে।';
        }
        
        setChatLog(prev => [
          ...prev,
          {
            sender: 'bot',
            message: errorMessage,
          },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Better error logging with type safety
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          config: error.config
        });
        
        // Check if it's a CORS error
        if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
          setChatLog(prev => [
            ...prev,
            {
              sender: 'bot',
              message: 'দুঃখিত, নেটওয়ার্ক সমস্যার কারণে সংযোগ স্থাপন করা যাচ্ছে না। CORS সমস্যা হতে পারে।',
            },
          ]);
        } else if (error.response?.status === 500) {
          setChatLog(prev => [
            ...prev,
            {
              sender: 'bot',
              message: 'দুঃখিত, সার্ভারে একটি সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
            },
          ]);
        } else {
          setChatLog(prev => [
            ...prev,
            {
              sender: 'bot',
              message: `দুঃখিত, একটি ত্রুটি হয়েছে (${error.response?.status || 'Unknown'}): ${error.message}`,
            },
          ]);
        }
      } else {
        console.error('Non-axios error:', error instanceof Error ? error.message : 'Unknown error');
        setChatLog(prev => [
          ...prev,
          {
            sender: 'bot',
            message: 'দুঃখিত, একটি অজানা ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 z-50"
        onClick={toggleChat}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        💬
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 bg-white w-96 max-w-full h-[500px] rounded-xl shadow-xl z-50 flex flex-col border-2 border-green-500"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="bg-green-600 text-white p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-lg font-semibold">🌱 কৃষি সহায়ক</h2>
              <button
                className="text-white text-2xl font-bold"
                onClick={toggleChat}
                aria-label="Close Chatbot"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {chatLog.length === 0 && (
                <p className="text-center text-gray-500 text-sm">
                  আপনার কৃষি সংক্রান্ত প্রশ্ন জিজ্ঞাসা করুন! 🌾
                </p>
              )}
              {chatLog.map((entry, index) => (
                <motion.div
                  key={index}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    entry.sender === 'user'
                      ? 'bg-green-500 text-white ml-auto'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="text-sm font-medium whitespace-pre-wrap">
                    {entry.message}
                  </p>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  className="p-3 rounded-lg max-w-[80%] bg-gray-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm font-medium">ভাবছি... 🤔</p>
                </motion.div>
              )}
            </div>

            <div className="p-4 bg-white border-t flex items-center">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm placeholder-gray-400"
                placeholder="আপনার প্রশ্ন লিখুন..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                className={`px-5 py-3 rounded-r-lg text-white font-semibold transition ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                পাঠান
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
