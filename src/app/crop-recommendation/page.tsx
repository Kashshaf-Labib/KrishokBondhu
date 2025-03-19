import CropRecommendationForm from "@/components/CropRecommendationForm";

export default function CropRecommendationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 flex flex-col items-center justify-center py-8 px-4">
      <p className="text-lg text-green-700 mb-6 text-center max-w-xl">
      আপনার মাটির এবং পরিবেশগত তথ্য ইনপুট করুন আপনার অবস্থার জন্য উপযুক্ত সেরা ফসলের সুপারিশ পেতে!
      </p>
      <CropRecommendationForm />
    </div>
  );
}

