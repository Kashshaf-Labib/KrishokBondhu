//src/app/disease-detection/page.tsx:

'use client';
import { useAuth } from '@clerk/nextjs';
import jsPDF from 'jspdf';
import { Leaf, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
      router.push('/sign-in');
    }
  }, [isSignedIn, router]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement> | File,
  ) => {
    const file = 'target' in event ? event.target.files?.[0] : event;
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setPrediction(null);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
      // First get the disease prediction
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/disease-detection', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Prediction request failed: ${await response.text()}`);
      }

      const data = await response.json();

      if (data.success) {
        try {
          // Get recommendations for the detected disease
          const queryResponse = await fetch('http://localhost:8000/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: `Give me a brief severity analysis and 3 specific prevention recommendations for ${data.data.disease} plant disease. Format the response as JSON with the following structure: { "severity": "string", "recommendations": ["string", "string", "string"] }`,
            }),
          });

          if (!queryResponse.ok) {
            throw new Error('Failed to get recommendations');
          }

          const recommendationData = await queryResponse.json();

          // Remove the backticks and clean the response
          const cleanedContent = recommendationData.content
            .replace(/```json\n?|\n?```/g, '')
            .trim();

          // Parse the cleaned JSON
          const parsedRecommendations = JSON.parse(cleanedContent);

          // Set the prediction with all required fields
          setPrediction({
            disease: data.data.disease,
            confidence: data.data.confidence,
            severity: parsedRecommendations.severity,
            recommendations: parsedRecommendations.recommendations,
          });

          console.log('Setting prediction:', {
            disease: data.data.disease,
            confidence: data.data.confidence,
            severity: parsedRecommendations.severity,
            recommendations: parsedRecommendations.recommendations,
          });
        } catch (queryError) {
          console.error('Query error:', queryError);
          setPrediction({
            disease: data.data.disease,
            confidence: data.data.confidence,
            severity: 'Unable to determine',
            recommendations: ['Unable to fetch recommendations at this time'],
          });
        }
      } else {
        throw new Error(data.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Error during prediction:', error);
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(prediction);
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

  const generatePDF = async () => {
    if (!selectedImage || !prediction) return;

    const pdf = new jsPDF();

    // Add title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Plant Disease Detection Report', 20, 20);

    // Disease Information Section
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(14);
    pdf.text('Disease Information', 20, 40);
    pdf.setFontSize(12);
    pdf.text(`- Disease: ${prediction.disease}`, 20, 50);
    pdf.text(`- Confidence: ${prediction.confidence}%`, 20, 60);
    pdf.text(`- Severity: ${prediction.severity}`, 20, 70);

    // Adding space after disease information
    let yOffset = 80;

    // Recommendations Section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Recommendations', 20, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    yOffset += 10;
    prediction.recommendations.forEach((rec, index) => {
      pdf.text(`- ${rec}`, 25, yOffset + index * 10);
    });

    // Adjust the offset for the image
    yOffset += prediction.recommendations.length * 10 + 10;

    // Add image (with proportional scaling)
    const imageElement = document.createElement('img');
    imageElement.src = selectedImage;

    imageElement.onload = () => {
      const aspectRatio = imageElement.width / imageElement.height;
      const imgWidth = 100;
      const imgHeight = imgWidth / aspectRatio;

      // Add the image to the PDF, with adjusted spacing
      pdf.addImage(selectedImage, 'JPEG', 20, yOffset, imgWidth, imgHeight);

      // Footer Section
      yOffset += imgHeight + 10;
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(10);
      pdf.text('Generated by Plant Disease Detection System', 20, yOffset);

      // Save the PDF
      pdf.save('disease_prediction_report.pdf');
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 relative">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/plant-disease-background2.jpg')" }}
      />

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
                ${
                  dragActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-dashed border-gray-300'
                }
                ${selectedImage ? 'border-solid border-green-500' : ''}`}
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
                  <img
                     src={selectedImage}
                     alt="Selected plant"
                     className="object-contain rounded-lg h-full w-full"
                  />
                </div>
              )}
            </div>

            {selectedImage && (
              <button
                onClick={handlePrediction}
                disabled={isLoading}
                className={`mt-6 w-full py-4 rounded-xl text-white font-medium 
                  ${
                    isLoading
                      ? 'bg-gray-400'
                      : 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900'
                  }`}
              >
                {isLoading ? 'Analyzing Image...' : 'Get Prediction'}
              </button>
            )}
          </div>

          {/* Prediction Section */}
          <div
            className={`bg-white/80 backdrop-blur-sm shadow-xl rounded-xl p-6 transition-all duration-500 
            ${prediction ? 'opacity-100' : 'opacity-0'}`}
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
          {/* Add this below the prediction section */}
          {prediction && (
            <div
              className="mt-6 text-sm cursor-pointer hover:text-green-600"
              onClick={generatePDF}
            >
              <button className="px-4 py-2 rounded-full text-white bg-green-700 hover:bg-green-800 transition duration-300">
                Download Prediction Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
