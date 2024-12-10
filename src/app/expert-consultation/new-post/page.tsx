// //src/app/new-post/page.tsx:
// "use client";
// import { useUser } from "@clerk/nextjs";
// import { useState } from "react";
// import { motion } from "framer-motion";

// export default function NewPost() {
//   const { user } = useUser();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState<File | null>(null); // To store the selected file
//   const [preview, setPreview] = useState<string | null>(null); // To store the preview URL

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file)); // Generate a preview URL
//     }
//   };

//   const handleSubmit = async () => {
//     if (!title || !description) {
//       alert("Please fill in all fields before submitting.");
//       return;
//     }

//     if (!user) {
//       alert("User not authenticated. Please log in.");
//       return;
//     }

//     const postData = {
//       userId: user.id, // Real userId from Clerk
//       username: user.username || user.firstName || "Anonymous",
//       title,
//       description,
//       image: preview || "", // Send image URL or leave it empty
//     };

//     try {
//       const response = await fetch("/api/posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json", // Ensure JSON header
//         },
//         body: JSON.stringify(postData), // Serialize as JSON
//       });

//       if (response.ok) {
//         alert("Post created successfully!");
//         setTitle("");
//         setDescription("");
//         setImage(null);
//         setPreview(null);
//       } else {
//         const error = await response.json();
//         console.error("Error creating post:", error);
//         alert("Failed to create post.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <motion.div
//       className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col items-center justify-center"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.8 }}
//     >
//       {/* Header */}
//       <motion.h1
//         className="text-4xl md:text-5xl font-extrabold text-green-900 mb-8 text-center"
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6 }}
//       >
//         Create a New Post
//       </motion.h1>

//       {/* Form Container */}
//       <motion.div
//         className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 space-y-6"
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//       >
//         {/* Title Input */}
//         <motion.input
//           type="text"
//           placeholder="Enter the post title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         />

//         {/* Description Input */}
//         <motion.textarea
//           placeholder="Write a detailed description..."
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
//           rows={6}
//           initial={{ x: 20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//         />

//         {/* Image Upload */}
//         <motion.div
//           className="space-y-4"
//           initial={{ scale: 0.95, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//         >
//           <label className="block text-gray-700 font-semibold">
//             Upload Image (Optional):
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="block w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-green-500"
//           />

//           {/* Image Preview */}
//           {preview && (
//             <div className="mt-4">
//               <p className="text-gray-500 text-sm mb-2">Image Preview:</p>
//               <img
//                 src={preview}
//                 alt="Selected Preview"
//                 className="w-full max-h-60 object-cover rounded-lg shadow-md"
//               />
//             </div>
//           )}
//         </motion.div>

//         {/* Submit Button */}
//         <motion.button
//           onClick={handleSubmit}
//           className="w-full bg-green-800 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//         >
//           Submit Post
//         </motion.button>
//       </motion.div>

//       {/* Decorative Bottom Section */}
//       <motion.div
//         className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 h-24 -z-10 rounded-t-full"
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6, delay: 0.4 }}
//       />
//     </motion.div>
//   );
// }

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

  // const handleSubmit = async () => {
  //   if (!title || !description) {
  //     alert("Please fill in all fields before submitting.");
  //     return;
  //   }

  //   if (!user) {
  //     alert("User not authenticated. Please log in.");
  //     return;
  //   }

  //   const postData = {
  //     userId: user.id,
  //     username: user.username || user.firstName || "Anonymous",
  //     title,
  //     description,
  //     image: preview || "",
  //   };

  //   try {
  //     const response = await fetch("/api/posts", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(postData),
  //     });

  //     if (response.ok) {
  //       alert("Post created successfully!");
  //       setTitle("");
  //       setDescription("");
  //       setImage(null);
  //       setPreview(null);
  //     } else {
  //       alert("Failed to create post.");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
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
          Ask Your Question
        </h1>
        <p className="text-gray-600 text-sm md:text-base mb-8">
          Share your ideas, issues, or questions with the community.
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            placeholder="e.g., How to fix issue X in framework Y?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            placeholder="Provide as much detail as possible about your question or issue."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Image (Optional)
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
                alt="Preview"
                className="max-h-60 rounded-md border"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-800 text-white py-3 rounded font-semibold hover:bg-green-700 transition"
        >
          Submit Your Question
        </button>
      </div>
    </motion.div>
  );
}


