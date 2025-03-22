// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import jsPDF from "jspdf";


// interface District {
//   _id: string;
//   district: string;
//   phosphorus_level_ug_per_g: number;
//   nitrogen_level_percent: number;
//   potassium_level_ug_per_g: number;
//   average_rainfall: number;
//   ph_value: number;
// }

// export default function CropRecommendationForm() {
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [formData, setFormData] = useState({
//     district: "",
//     N: "",
//     P: "",
//     K: "",
//     temperature: "",
//     humidity: "",
//     ph: "",
//     rainfall: "",
//   });
//   const [recommendation, setRecommendation] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDistricts = async () => {
//       try {
//         const response = await fetch("/api/districts");
//         if (!response.ok) {
//           throw new Error(`Error: ${response.status}`);
//         }
//         const data = await response.json();
//         setDistricts(data);
//       } catch (err) {
//         setError((err as Error).message);
//       }
//     };

//     fetchDistricts();
//   }, []);

//   const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedDistrict = districts.find(
//       (district) => district.district === e.target.value
//     );

//     if (selectedDistrict) {
//       setFormData({
//         ...formData,
//         district: selectedDistrict.district,
//         N: selectedDistrict.nitrogen_level_percent.toString(),
//         P: selectedDistrict.phosphorus_level_ug_per_g.toString(),
//         K: selectedDistrict.potassium_level_ug_per_g.toString(),
//         rainfall: selectedDistrict.average_rainfall.toString(),
//         ph: selectedDistrict.ph_value.toString(),
//       });
//     } else {
//       setFormData({
//         ...formData,
//         district: "",
//         N: "",
//         P: "",
//         K: "",
//         rainfall: "",
//       });
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setRecommendation(null);

//     try {
//       const response = await fetch("http://localhost:8000/recommendcrop", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           district: formData.district,
//           N: parseFloat(formData.N),
//           P: parseFloat(formData.P),
//           K: parseFloat(formData.K),
//           temperature: parseFloat(formData.temperature),
//           humidity: parseFloat(formData.humidity),
//           ph: parseFloat(formData.ph),
//           rainfall: parseFloat(formData.rainfall),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }

//       const data = await response.json();
//       setRecommendation(data.prediction);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateReport = async () => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text("ফসল সুপারিশ রিপোর্ট", 105, 20, { align: "center" });

//     doc.setFontSize(12);
//     doc.text(`জেলা: ${formData.district}`, 20, 40);

//     doc.text("পরিবেশগত পরামিতিসমূহ:", 20, 60);
//     const parameters = [
//       { label: "নাইট্রোজেন (এন)", value: `${formData.N} %`, y: 70 },
//       { label: "ফসফরাস (পি)", value: `${formData.P} ug/g`, y: 80 },
//       { label: "পটাসিয়াম (কে)", value: `${formData.K} ug/g`, y: 90 },
//       { label: "তাপমাত্রা", value: `${formData.temperature} °C`, y: 100 },
//       { label: "আর্দ্রতা", value: `${formData.humidity} %`, y: 110 },
//       { label: "pH মান", value: formData.ph, y: 120 },
//       { label: "বৃষ্টিপাত", value: `${formData.rainfall} মিমি`, y: 130 },
//     ];

//     parameters.forEach((param) => {
//       doc.text(`${param.label}:`, 30, param.y);
//       doc.text(param.value, 100, param.y);
//     });

//     doc.setFontSize(14);
//     doc.text("সুপারিশকৃত ফসল:", 20, 150);
//     doc.setFontSize(12);
//     if (recommendation) {
//       doc.text(recommendation, 30, 160);
//     }

//     const currentDate = new Date().toLocaleDateString();
//     doc.setFontSize(10);
//     doc.text(`রিপোর্ট তৈরির তারিখ: ${currentDate}`, 20, 280);

//     doc.save(`ফসল_সুপারিশ_${formData.district}_${currentDate}.pdf`);
//   };

//   return (
//     <motion.div
//       className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-lg mx-auto my-8"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8 }}
//     >
//       <form onSubmit={handleSubmit} className="space-y-8">
//         <div>
//           <label
//             htmlFor="district"
//             className="block text-base font-semibold text-gray-700"
//           >
//             জেলা নির্বাচন করুন:
//           </label>
//           <select
//             id="district"
//             name="district"
//             value={formData.district}
//             onChange={handleDistrictChange}
//             required
//             className="mt-2 w-full border-2 border-gray-300 rounded-xl shadow-md p-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//           >
//             <option value="">একটি জেলা নির্বাচন করুন</option>
//             {districts.map((district) => (
//               <option key={district._id} value={district.district}>
//                 {district.district}
//               </option>
//             ))}
//           </select>
//         </div>

//         {[
//           {
//             label: "নাইট্রোজেন",
//             name: "N",
//             placeholder: "নাইট্রোজেনের পরিমাণ (%)",
//           },
//           {
//             label: "ফসফরাস",
//             name: "P",
//             placeholder: "ফসফরাসের পরিমাণ (ug/g)",
//           },
//           {
//             label: "পটাসিয়াম",
//             name: "K",
//             placeholder: "পটাসিয়ামের পরিমাণ (ug/g)",
//           },
//           {
//             label: "তাপমাত্রা (°C)",
//             name: "temperature",
//             placeholder: "তাপমাত্রা ইনপুট করুন",
//           },
//           {
//             label: "আর্দ্রতা",
//             name: "humidity",
//             placeholder: "আর্দ্রতা ইনপুট করুন",
//           },
//           {
//             label: "pH মান",
//             name: "ph",
//             placeholder: "pH মান ইনপুট করুন",
//           },
//           {
//             label: "বৃষ্টিপাত (মিমি)",
//             name: "rainfall",
//             placeholder: "গড় বৃষ্টিপাত (মিমি)",
//           },
//         ].map((field) => (
//           <div key={field.name}>
//             <label
//               htmlFor={field.name}
//               className="block text-lg font-semibold text-gray-700"
//             >
//               {field.label}:
//             </label>
//             <input
//               type="number"
//               step="any"
//               id={field.name}
//               name={field.name}
//               value={formData[field.name as keyof typeof formData]}
//               onChange={handleInputChange}
//               required
//               className="mt-2 w-full border-2 border-gray-300 rounded-xl shadow-md p-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder={field.placeholder}
//             />
//           </div>
//         ))}

//         <motion.button
//           type="submit"
//           className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition duration-300 text-lg font-semibold"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           disabled={loading}
//         >
//           {loading ? "লোড হচ্ছে..." : "ফসল সুপারিশ পান"}
//         </motion.button>
//       </form>

//       {recommendation && (
//         <motion.div
//           className="mt-6 p-4 bg-green-100 text-green-800 rounded-xl shadow-md"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div>
//             <h3 className="font-bold text-lg">সুপারিশকৃত ফসল:</h3>
//             <p className="mt-1 text-lg">{recommendation}</p>
//           </div>
//           <p className="mt-4 text-sm text-gray-600">
//             বিস্তারিত রিপোর্টের জন্য PDF আকারে ডাউনলোড করতে{" "}
//             <span
//               onClick={generateReport}
//               className="text-blue-600 underline cursor-pointer hover:text-blue-800"
//             >
//               এখানে ক্লিক করুন
//             </span>
//           </p>
//         </motion.div>
//       )}

//       {error && (
//         <motion.div
//           className="mt-6 p-4 bg-red-100 text-red-800 rounded-xl shadow-md"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h3 className="font-bold text-lg">ত্রুটি:</h3>
//           <p className="mt-1">{error}</p>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface District {
  _id: string;
  district: string;
  phosphorus_level_ug_per_g: number;
  nitrogen_level_percent: number;
  potassium_level_ug_per_g: number;
  average_rainfall: number;
  ph_value: number;
}

export default function CropRecommendationForm() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [formData, setFormData] = useState({
    district: "",
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("/api/districts");
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setDistricts(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchDistricts();
  }, []);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = districts.find(
      (district) => district.district === e.target.value
    );

    if (selectedDistrict) {
      setFormData({
        ...formData,
        district: selectedDistrict.district,
        N: selectedDistrict.nitrogen_level_percent.toString(),
        P: selectedDistrict.phosphorus_level_ug_per_g.toString(),
        K: selectedDistrict.potassium_level_ug_per_g.toString(),
        rainfall: selectedDistrict.average_rainfall.toString(),
        ph: selectedDistrict.ph_value.toString(),
      });
    } else {
      setFormData({
        ...formData,
        district: "",
        N: "",
        P: "",
        K: "",
        rainfall: "",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const response = await fetch("http://localhost:8000/recommendcrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: formData.district,
          N: parseFloat(formData.N),
          P: parseFloat(formData.P),
          K: parseFloat(formData.K),
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          ph: parseFloat(formData.ph),
          rainfall: parseFloat(formData.rainfall),
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setRecommendation(data.prediction);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      const response = await fetch("/api/generate-crop-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, recommendation }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ফসল_সুপারিশ_${formData.district}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("PDF জেনারেট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-lg mx-auto my-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* District Selector */}
        <div>
          <label htmlFor="district" className="block text-base font-semibold text-gray-700">
            জেলা নির্বাচন করুন:
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleDistrictChange}
            required
            className="mt-2 w-full border-2 border-gray-300 rounded-xl shadow-md p-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">একটি জেলা নির্বাচন করুন</option>
            {districts.map((district) => (
              <option key={district._id} value={district.district}>
                {district.district}
              </option>
            ))}
          </select>
        </div>

        {/* Form Fields */}
        {[
          { label: "নাইট্রোজেন", name: "N", placeholder: "নাইট্রোজেনের পরিমাণ (%)" },
          { label: "ফসফরাস", name: "P", placeholder: "ফসফরাসের পরিমাণ (ug/g)" },
          { label: "পটাসিয়াম", name: "K", placeholder: "পটাসিয়ামের পরিমাণ (ug/g)" },
          { label: "তাপমাত্রা (°C)", name: "temperature", placeholder: "তাপমাত্রা ইনপুট করুন" },
          { label: "আর্দ্রতা", name: "humidity", placeholder: "আর্দ্রতা ইনপুট করুন" },
          { label: "pH মান", name: "ph", placeholder: "pH মান ইনপুট করুন" },
          { label: "বৃষ্টিপাত (মিমি)", name: "rainfall", placeholder: "গড় বৃষ্টিপাত (মিমি)" },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-lg font-semibold text-gray-700">
              {field.label}:
            </label>
            <input
              type="number"
              step="any"
              id={field.name}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleInputChange}
              required
              className="mt-2 w-full border-2 border-gray-300 rounded-xl shadow-md p-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={field.placeholder}
            />
          </div>
        ))}

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition duration-300 text-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "লোড হচ্ছে..." : "ফসল সুপারিশ পান"}
        </motion.button>
      </form>

      {/* Recommendation Result */}
      {recommendation && (
        <motion.div
          className="mt-6 p-4 bg-green-100 text-green-800 rounded-xl shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h3 className="font-bold text-lg">সুপারিশকৃত ফসল:</h3>
            <p className="mt-1 text-lg">{recommendation}</p>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            বিস্তারিত রিপোর্টের জন্য PDF আকারে ডাউনলোড করতে{" "}
            <span
              onClick={generateReport}
              className="text-blue-600 underline cursor-pointer hover:text-blue-800"
            >
              এখানে ক্লিক করুন
            </span>
          </p>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          className="mt-6 p-4 bg-red-100 text-red-800 rounded-xl shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-bold text-lg">ত্রুটি:</h3>
          <p className="mt-1">{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
}