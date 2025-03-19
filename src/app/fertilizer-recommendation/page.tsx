import FertilizerRecommendationForm from '@/components/FertilizerRecommendationForm';

export default function FertilizerRecommendationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 flex flex-col items-center justify-center py-8 px-4">
      <p className="text-lg text-green-700 mb-6 text-center max-w-xl">
      আপনার ফসল ও মাটির অবস্থার জন্য উপযুক্ত সার সুপারিশ পেতে পরিবেশ ও মাটির তথ্য প্রদান করুন।
      </p>
      <FertilizerRecommendationForm />
    </div>
  );
}
