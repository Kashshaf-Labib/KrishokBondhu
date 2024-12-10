// //src/app/disease-detection/page.tsx:

"use client";
import { predictDisease } from "@/utils/disease_api";
import { useAuth } from "@clerk/nextjs";
import { Leaf, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Prediction {
  disease: string;
  confidence: number;
  severity: string;
  recommendations: string[];
}

export default function DiseasePredictionPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement> | File
  ) => {
    const file = "target" in event ? event.target.files?.[0] : event;
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setPrediction(null);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePrediction = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      // Use fetch to send data to the API route
      const response = await fetch('/api/disease-detection', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        console.error("Prediction request failed:", await response.text());
        setIsLoading(false);
        return;
      }
  
      const data = await response.json();
  
      if (data.success) {
        setPrediction({
          disease: data.data.disease,
          confidence: data.data.confidence, // Assuming confidence is already in percentage
          severity: 'Moderate', // Replace with actual data if available from API
          recommendations: [
            'Apply copper-based fungicide',
            'Improve air circulation',
            'Reduce overhead watering',
          ],
        });
      } else {
        console.error('Prediction error:', data.message);
      }
    } catch (error) {
      console.error('Error during prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setSelectedFile(null);
    setPrediction(null);
  };

  if (!isSignedIn) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 relative">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('/plant-disease-background.jpg')" }} />
      
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-green-200 rounded-full opacity-10 animate-pulse" />
        <div className="absolute top-1/4 -left-1/4 w-64 h-64 bg-green-300 rounded-full opacity-10 animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block">
            <Leaf className="h-12 w-12 text-green-600 animate-bounce" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
            Plant Disease Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Harness the power of AI to identify plant diseases instantly. Upload
            a photo and get detailed analysis within seconds.
          </p>
        </div>

        <div className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl p-6">
            <div
              className={`relative h-80 border-2 rounded-xl flex items-center justify-center
                ${dragActive ? "border-green-500 bg-green-50" : "border-dashed border-gray-300"}
                ${selectedImage ? "border-solid border-green-500" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!selectedImage ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <Upload className="h-16 w-16 text-green-600 mb-4 animate-bounce" />
                  <label className="cursor-pointer text-center">
                    <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium hover:bg-green-200">
                      Choose a file
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    <p className="mt-4 text-gray-500">
                      or drag and drop your image here
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative h-full">
                  <button
                    onClick={clearImage}
                    className="absolute -right-3 -top-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Image
                    src={selectedImage}
                    alt="Selected plant"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </div>

            {selectedImage && (
              <button
                onClick={handlePrediction}
                disabled={isLoading}
                className={`mt-6 w-full py-4 rounded-xl text-white font-medium 
                  ${isLoading
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
                  }`}
              >
                {isLoading ? "Analyzing Image..." : "Get Prediction"}
              </button>
            )}
          </div>

          {/* Prediction Section */}
          <div
            className={`bg-white/80 backdrop-blur-sm shadow-xl rounded-xl p-6 transition-all duration-500 
            ${prediction ? "opacity-100" : "opacity-0"}`}
          >
            {prediction ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Analysis Results
                </h3>
                <p className="text-2xl font-bold text-green-800">
                  Detected Disease: {prediction.disease}
                </p>
                <p>Confidence: {prediction.confidence}%</p>
                <p>Severity: {prediction.severity}</p>
                <ul>
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">
                Upload an image to get started with the analysis.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
