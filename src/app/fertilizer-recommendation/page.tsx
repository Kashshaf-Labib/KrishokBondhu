import FertilizerRecommendationForm from "@/components/FertilizerRecommendationForm";

export default function FertilizerRecommendationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 flex flex-col items-center justify-center py-8 px-4">
      <p className="text-lg text-green-700 mb-6 text-center max-w-xl">
        Input environmental and soil data to receive the best fertilizer
        recommendations tailored to your crop and soil conditions.
      </p>
      <FertilizerRecommendationForm />
    </div>
  );
}
