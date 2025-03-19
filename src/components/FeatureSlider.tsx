
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination"; // Importing styles for pagination
import "swiper/css/autoplay"; // Importing styles for autoplay
import FeatureItem from "./FeatureItem";
import styles from "@/app/styles/FeatureSection.module.css";
import { motion } from "framer-motion";

// Import the necessary Swiper modules from swiper/modules
import { Pagination, Autoplay } from "swiper/modules";

const features = [
  {
    title: "উদ্ভিদ রোগ সনাক্তকরণ",
    description:
      "উদ্ভিদের ছবি আপলোড করে বিস্তারিত রোগ বিশ্লেষণ করুন। প্রাথমিক সনাক্তকরণ ও প্রতিরোধের মাধ্যমে ফসলের ক্ষতি কমিয়ে আনুন। সময়মতো ব্যবস্থা নেওয়ার জন্য নির্দিষ্ট সমাধান ও পরামর্শ পান।",
    image: "/disease-detection.jpeg",
  },
  {
    title: "মাটির তথ্যের ভিত্তিতে ফসল সুপারিশ",
    description:
      "মাটির pH মান ও পুষ্টি স্তরের তথ্য ব্যবহার করে আপনার জমির জন্য সর্বোত্তম ফসল নির্বাচন করুন। এটি জমির সর্বোত্তম ব্যবহার, উন্নত ফলন ও টেকসই চাষাবাদ নিশ্চিত করে।",
    image: "/soil-suggestion.jpeg",
  },
  {
    title: "সার সুপারিশ",
    description:
      "ফসল ও মাটির অবস্থা অনুযায়ী সঠিক সারের পরামর্শ পান। ফসলের সঠিক বৃদ্ধি নিশ্চিত করার পাশাপাশি অপ্রয়োজনীয় সার ব্যয় কমিয়ে আনুন।",
    image: "/fertilizer-suggestion.png",
  },
  {
    title: "বিশেষজ্ঞ পরামর্শ",
    description:
      "কৃষি বিশেষজ্ঞদের পরামর্শ পান এবং উন্নত ফলনের জন্য ফসল ব্যবস্থাপনা ও চাষাবাদ সম্পর্কে সঠিক সিদ্ধান্ত নিন।",
    image: "/expert-consultation.png",
  },
];


const FeatureSlider = () => {
  return (
    <motion.section
      className={styles.featureSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{ delay: 2000 }} // Auto-slide every 2 seconds
        pagination={{
          clickable: true, // Make pagination dots clickable
          bulletClass: `${styles.customBullet}`, // Custom class for pagination dots
          bulletActiveClass: `${styles.customBulletActive}`, // Custom class for active bullet
        }}
        modules={[Pagination, Autoplay]} // Use the modules directly here
      >
        {features.map((feature, index) => (
          <SwiperSlide key={index}>
            <FeatureItem
              title={feature.title}
              description={feature.description}
              image={feature.image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

export default FeatureSlider;