// import CropRecommendationForm from "@/components/CropRecommendationForm";

// export default function CropRecommendationPage() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-green-700">Crop Recommendation System</h1>
//       <CropRecommendationForm />
//     </div>
//   );
// }
import CropRecommendationForm from "@/components/CropRecommendationForm";

export default function CropRecommendationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 flex flex-col items-center justify-center py-8 px-4">
      <p className="text-lg text-green-700 mb-6 text-center max-w-xl">
        Input soil and environmental data to get the best crop recommendations tailored to your conditions!
      </p>
      <CropRecommendationForm />
    </div>
  );
}

