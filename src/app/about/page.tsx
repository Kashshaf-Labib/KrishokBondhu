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
              <span>Our Mission</span>
            </span>
          </h2>
          <p className="mt-8 text-lg text-gray-100">
            At KrishokBondhu, our mission is to integrate cutting-edge AI and
            machine learning technologies to help farmers optimize productivity,
            reduce costs, and enhance sustainability. Through personalized
            recommendations, real-time disease detection, and expert
            consultations, we strive to make farming smarter and more efficient.
          </p>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-green-900">
            Our Core Features
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-6 transition-transform duration-300 hover:scale-105">
              <img
                src="/plant-disease-icon.png"
                alt="Plant Disease Detection"
                className="w-16 h-16 mb-4"
              />
              <h3 className="mt-4 font-medium text-xl text-green-800">
                Plant Disease Detection
              </h3>
              <p className="mt-2 text-gray-600">
                Detect and diagnose plant diseases with AI-powered technology
                for healthier crops.
              </p>
            </div>
            <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-6 transition-transform duration-300 hover:scale-105">
              <img
                src="/fertilizer-suggestion-icon.png"
                alt="Fertilizer Suggestions"
                className="w-16 h-16 mb-4"
              />
              <h3 className="mt-4 font-medium text-xl text-green-800">
                Fertilizer Recommendations
              </h3>
              <p className="mt-2 text-gray-600">
                Get tailored fertilizer recommendations based on soil and crop
                needs to maximize yields.
              </p>
            </div>
            <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-6 transition-transform duration-300 hover:scale-105">
              <img
                src="/soil-suggestion-icon.png"
                alt="Soil Suggestions"
                className="w-16 h-16 mb-4"
              />
              <h3 className="mt-4 font-medium text-xl text-green-800">
                Soil Recommendations
              </h3>
              <p className="mt-2 text-gray-600">
                Optimize soil health with personalized recommendations for
                better crop growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Consultation Section */}
      <section className="py-16 bg-gradient-to-t from-white to-green-200 text-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800">
            Expert Consultation
          </h2>
          <p className="mt-8 text-lg text-gray-700">
            Farmers can interact with agricultural experts on our platform for
            personalized advice on crop management, pest control, soil health,
            and more. Simply post your query or issue, and get expert
            recommendations on how to resolve it.
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
              <span>Future Growth</span>
            </span>
          </h2>
          <p className="mt-8 text-lg text-gray-100">
            Our platform is continuously evolving, with exciting plans for new
            features like mobile app development, automated notifications, and
            global expansion. We aim to bring our AI-powered solutions to
            farmers worldwide, helping them make data-driven decisions and
            enhancing sustainability in agriculture.
          </p>
        </div>
      </section>

      {/* Team Section with Proper Alignment */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-green-900">
            Meet the Team
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
                src="/Navid.jpg"
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
              <span>Contact Us</span>
            </span>
          </h2>
          <p className="mt-8 text-lg text-gray-800">
            For inquiries, support, or expert consultations, feel free to reach
            out to us:
          </p>
          <div className="mt-8">
            <p>Email: support@krishokbondhu.com</p>
            <p>Phone: +880-123-456-789</p>
            <p>Location: Islamic University of Technology, Dhaka, Bangladesh</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
