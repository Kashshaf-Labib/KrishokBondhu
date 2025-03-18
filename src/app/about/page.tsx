"use client";
import React from "react";

// Client-side About page component
const About = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* Mission Statement Section with Full Background Image */}
      <section
        className="py-40 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/vision-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 backdrop-blur-md"></div>{" "}
        {/* Adding blur effect */}
        <div className="max-w-6xl mx-auto text-center relative z-10 text-white">
          <h2 className="text-4xl font-bold tracking-wide">
            <span className="flex items-center justify-center space-x-2">
              {/* Ensure the target icon exists in the public folder */}
              <img
                src="/target-icon-2.png"
                alt="Target Icon"
                className="w-8 h-8"
              />
              <span>আমাদের লক্ষ্য</span>
            </span>
          </h2>
          <p className="mt-8 text-lg text-gray-100">
            কৃষকবন্ধু-তে, আমাদের লক্ষ্য হল আধুনিক এআই এবং মেশিন লার্নিং
            প্রযুক্তি ব্যবহার করে কৃষকদের উৎপাদনশীলতা বৃদ্ধি, ব্যয় হ্রাস, এবং
            টেকসই চাষাবাদ নিশ্চিত করা। ব্যক্তিগত সুপারিশ, রিয়েল-টাইম রোগ
            সনাক্তকরণ এবং বিশেষজ্ঞ পরামর্শের মাধ্যমে আমরা কৃষিকে আরও স্মার্ট এবং
            কার্যকরী করে তুলতে চাই।
          </p>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-green-900">
          আমাদের মূল সেবা
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-6 transition-transform duration-300 hover:scale-105">
              <img
                src="/plant-disease-icon.png"
                alt="Plant Disease Detection"
                className="w-16 h-16 mb-4"
              />
              <h3 className="mt-4 font-medium text-xl text-green-800">
              গাছের রোগ সনাক্তকরণ
              </h3>
              <p className="mt-2 text-gray-600">
              এআই প্রযুক্তির মাধ্যমে গাছের রোগ চিহ্নিত করুন এবং সুস্থ ফসল নিশ্চিত করুন।
              </p>
            </div>
            <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-6 transition-transform duration-300 hover:scale-105">
              <img
                src="/fertilizer-suggestion-icon.png"
                alt="Fertilizer Suggestions"
                className="w-16 h-16 mb-4"
              />
              <h3 className="mt-4 font-medium text-xl text-green-800">
              সার ব্যবস্থাপনা পরামর্শ
              </h3>
              <p className="mt-2 text-gray-600">
              মাটি ও ফসল অনুযায়ী সঠিক সার ব্যবহারের পরামর্শ পান।
              </p>
            </div>
            <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-6 transition-transform duration-300 hover:scale-105">
              <img
                src="/soil-suggestion-icon.png"
                alt="Soil Suggestions"
                className="w-16 h-16 mb-4"
              />
              <h3 className="mt-4 font-medium text-xl text-green-800">
              যথাযথ মাটির সুপারিশ
              </h3>
              <p className="mt-2 text-gray-600">
              ফসল বৃদ্ধির জন্য মাটির স্বাস্থ্য উন্নত করার কৌশল শিখুন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Consultation Section */}
      <section className="py-16 bg-gradient-to-t from-white to-green-200 text-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800">
          বিশেষজ্ঞ পরামর্শ
          </h2>
          <p className="mt-8 text-lg text-gray-700">
          কৃষকরা আমাদের প্ল্যাটফর্মের মাধ্যমে কৃষি বিশেষজ্ঞদের সাথে যোগাযোগ করতে
            পারেন। ফসল ব্যবস্থাপনা, কীটনাশক নিয়ন্ত্রণ, মাটির স্বাস্থ্য এবং আরও
            অনেক বিষয়ে ব্যক্তিগত পরামর্শ নিন।
          </p>
          <div className="mt-8 flex justify-center">
            <img
              src="/expert-consult-icon.png"
              alt="Expert Consultation"
              className="w-32 h-32 transition-transform duration-300 hover:scale-110"
            />
          </div>
        </div>
      </section>

      {/* Future Growth and Vision Section with Background Image */}
      <section
        className="py-40 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/future-growth-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>{" "}
        {/* Dark background to enhance contrast */}
        <div className="absolute inset-0 backdrop-blur-md"></div>{" "}
        {/* Adding blur effect */}
        <div className="max-w-6xl mx-auto text-center relative z-10 text-white">
          <h2 className="text-3xl font-semibold text-white">
            <span className="flex items-center justify-center space-x-2">
              {/* Adding Future Growth Icon */}
              <img
                src="/future-growth-icon.png"
                alt="Future Growth Icon"
                className="w-8 h-8"
              />
              <span>ভবিষ্যৎ পরিকল্পনা</span>
            </span>
          </h2>
          <p className="mt-8 text-lg text-gray-100">
          আমাদের প্ল্যাটফর্ম ক্রমাগত উন্নতির পথে রয়েছে, যেখানে নতুন বৈশিষ্ট্যের
            সংযোজন যেমন মোবাইল অ্যাপ উন্নয়ন, স্বয়ংক্রিয় নোটিফিকেশন, এবং বিশ্বব্যাপী
            সম্প্রসারণের পরিকল্পনা রয়েছে। আমরা আমাদের এআই-চালিত সমাধান বিশ্বব্যাপী
            কৃষকদের কাছে পৌঁছে দিতে চাই, যাতে তারা ডেটা-ভিত্তিক সিদ্ধান্ত গ্রহণ করতে
            পারে এবং কৃষিতে স্থায়িত্ব বৃদ্ধি করতে পারে।
          </p>
        </div>
      </section>

      {/* Team Section with Proper Alignment */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-green-900">
          আমাদের টীম
          </h2>
          <div className="mt-8 flex justify-center gap-12">
            <div className="w-1/4 flex flex-col items-center">
              <img
                src="/Kashshaf.jpg"
                alt="Kashshaf Labib"
                className="w-35 h-35 rounded-full mb-4 shadow-lg"
              />
              <h3 className="mt-4 text-xl">Kashshaf Labib</h3>
              <p className="text-gray-600">Team Member</p>
            </div>
            <div className="w-1/4 flex flex-col items-center">
              <img
                src="/Navid.jpeg"
                alt="Navid Kamal"
                className="w-35 h-35 rounded-full mb-4 shadow-lg"
              />
              <h3 className="mt-4 text-xl">Navid Kamal</h3>
              <p className="text-gray-600">Team Member</p>
            </div>
            <div className="w-1/4 flex flex-col items-center">
              <img
                src="/Shefayat.JPG"
                alt="Shefayat E - Shams Adib"
                className="w-35 h-35 rounded-full mb-4 shadow-lg"
              />
              <h3 className="mt-4 text-xl">Shefayat E Shams Adib</h3>
              <p className="text-gray-600">Team Member</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with White-to-Green Gradient */}
      <section className="py-16 bg-gradient-to-r from-green-300 via-green-100 to-green-300 text-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-green-900">
            <span className="flex items-center justify-center space-x-2">
              <img
                src="/contact-icon.png"
                alt="Contact Icon"
                className="w-8 h-8"
              />
              <span>যোগাযোগ করুন</span>
            </span>
          </h2>
          <p className="mt-8 text-lg text-gray-800">
          যেকোনো অনুসন্ধান, সহায়তা, বা বিশেষজ্ঞ পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন:
          </p>
          <div className="mt-8">
          <p>ইমেইল: support@krishokbondhu.com</p>
            <p>ফোন: +৮৮০-১২৩-৪৫৬-৭৮৯</p>
            <p>অবস্থান: ইসলামিক ইউনিভার্সিটি অফ টেকনোলজি, ঢাকা, বাংলাদেশ</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
