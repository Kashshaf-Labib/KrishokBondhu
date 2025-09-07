'use client';
import { useAuth } from '@clerk/nextjs';
import { Leaf, Upload, X } from 'lucide-react';
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
  const [pdfGenerating, setPdfGenerating] = useState(false);

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
          const queryResponse = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL ||
              'https://krishok-bondhu-backend-1.onrender.com'
            }/query`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: `Give me a brief severity analysis and 3 specific prevention recommendations for ${data.data.disease} plant disease.`,
              }),
            },
          );

          if (!queryResponse.ok) {
            throw new Error('Failed to get recommendations');
          }

          const recommendationData = await queryResponse.json();
          const parsedRecommendations = JSON.parse(recommendationData.content);

          setPrediction({
            disease: parsedRecommendations.disease || data.data.disease,
            confidence: data.data.confidence,
            severity: parsedRecommendations.severity,
            recommendations: parsedRecommendations.recommendations,
          });
        } catch (queryError) {
          console.error('Query error:', queryError);
          setPrediction({
            disease: data.data.disease,
            confidence: data.data.confidence,
            severity: 'রোগের মাত্রা নির্ধারণ করা যায়নি',
            recommendations: [
              'সুপারিশ পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
            ],
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

  const clearImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setSelectedFile(null);
    setPrediction(null);
  };

  if (!isSignedIn) {
    return null;
  }

  const generatePDF = async () => {
    if (!selectedImage || !prediction) return;

    setPdfGenerating(true);

    try {
      // Convert the image to base64
      const imageBase64 = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile!);
      });

      // Call the API route to generate PDF on the server
      const response = await fetch('/api/generate-disease-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prediction,
          imageBase64,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF as a blob
      const pdfBlob = await response.blob();

      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'disease_prediction_report.pdf';
      document.body.appendChild(a);
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('PDF তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 relative">
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
          <h2 className="text-5xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
            উদ্ভিদ রোগ সনাক্তকরণ
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            কৃত্রিম বুদ্ধিমত্তার শক্তি ব্যবহার করে তাত্ক্ষণিকভাবে উদ্ভিদের রোগ
            সনাক্ত করুন। একটি ফটো আপলোড করুন এবং সেকেন্ডের মধ্যে বিস্তারিত
            বিশ্লেষণ পান।
          </p>
        </div>

        <div className="space-y-8">
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
                      ফাইল নির্বাচন করুন
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    <p className="mt-4 text-gray-500">
                      অথবা ছবিটি এখানে টেনে এনে ছাড়ুন
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
                {isLoading ? 'ছবি বিশ্লেষণ করা হচ্ছে...' : 'বিশ্লেষণ শুরু করুন'}
              </button>
            )}
          </div>

          <div
            className={`bg-white/80 backdrop-blur-sm shadow-xl rounded-xl p-6 transition-all duration-500 
            ${prediction ? 'opacity-100' : 'opacity-0'}`}
          >
            {prediction ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  ফলাফল বিশ্লেষণ
                </h3>
                <p className="text-2xl font-bold text-green-800">
                  সনাক্তকৃত রোগ: {prediction.disease}
                </p>
                <p>নির্ভুলতা: {prediction.confidence}%</p>
                <p>রোগের মাত্রা: {prediction.severity}</p>
                <div className="mt-4">
                  <h4 className="font-bold mb-2">প্রতিকারের উপায়:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-700">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                বিশ্লেষণের জন্য একটি ছবি আপলোড করুন।
              </p>
            )}
          </div>

          {prediction && (
            <div className="mt-6 text-center">
              <button
                className="px-4 py-2 rounded-full text-white bg-green-700 hover:bg-green-800 transition duration-300 disabled:bg-gray-400"
                onClick={generatePDF}
                disabled={pdfGenerating}
              >
                {pdfGenerating
                  ? 'রিপোর্ট তৈরি হচ্ছে...'
                  : 'রিপোর্ট ডাউনলোড করুন'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
