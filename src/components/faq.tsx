"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../app/styles/FAQ.module.css";

const faqData = [
  {
    question: "এই প্ল্যাটফর্মটি কী এবং এটি কৃষক হিসেবে আমাকে কীভাবে সাহায্য করবে?",
    answer:
      "এই প্ল্যাটফর্মে এআই-চালিত সরঞ্জাম রয়েছে যা উদ্ভিদ রোগ সনাক্তকরণ, মাটির তথ্যের ভিত্তিতে ফসল সুপারিশ, সঠিক সার নির্বাচন এবং বিশেষজ্ঞ পরামর্শ প্রদান করে কৃষি পদ্ধতি উন্নত করতে সাহায্য করে।",
  },
  {
    question: "উদ্ভিদ রোগ সনাক্ত করতে কীভাবে ছবি আপলোড করব?",
    answer:
      "লগইন করার পর 'উদ্ভিদ রোগ সনাক্তকরণ' বিভাগে গিয়ে আক্রান্ত গাছের স্পষ্ট ছবি আপলোড করুন। সিস্টেম ছবি বিশ্লেষণ করে বিস্তারিত ফলাফল প্রদর্শন করবে।",
  },
  {
    question: "ফসল সুপারিশের জন্য কী ধরনের মাটির তথ্য প্রয়োজন?",
    answer:
      "আপনাকে মাটির pH মান, নাইট্রোজেন, ফসফরাস এবং পটাসিয়ামের মাত্রার মতো মৌলিক পরামিতিগুলো ইনপুট দিতে হবে। প্ল্যাটফর্ম আপনার জমির জন্য উপযুক্ত সেরা ফসল সুপারিশ করবে।",
  },
  {
    question: "ফসল ও সার সুপারিশের নির্ভুলতা কতটা?",
    answer:
      "সুপারিশসমূহ বড় ডেটাসেট এবং মেশিন লার্নিং অ্যালগরিদমের ভিত্তিতে তৈরি। অত্যন্ত নির্ভুল হলেও বিশেষ উদ্বেগ থাকলে বিশেষজ্ঞের পরামর্শ নেওয়া উচিত।",
  },
  {
    question: "প্ল্যাটফর্মে কৃষি বিশেষজ্ঞের সাথে কীভাবে পরামর্শ করব?",
    answer:
      "বিশেষজ্ঞ পরামর্শের জন্য 'বিশেষজ্ঞ পরামর্শ' বিভাগে গিয়ে সরাসরি চ্যাট করুন। আপনি প্রশ্ন জিজ্ঞাসা করতে পারেন বা পরামর্শের জন্য ছবি শেয়ার করতে পারেন।",
  },
  {
    question: "ভবিষ্যতে প্ল্যাটফর্মে আরো ফিচার যোগ হবে কি?",
    answer:
      "হ্যাঁ, আমরা ক্রমাগত নতুন ফিচার যোগ করছি যেমন পোকা সনাক্তকরণ, ফলন পূর্বাভাস এবং স্মার্ট ফার্মিং সরঞ্জামের সাথে ইন্টিগ্রেশন।",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <motion.section
      className={styles.faqSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.faqContainer}>
        <div className={styles.imageContainer}>
          <img src="/FAQ.png" alt="জিজ্ঞাসিত প্রশ্ন" className={styles.faqImage} />
        </div>
        <motion.div
          className={styles.faqContent}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delayChildren: 0.3, staggerChildren: 0.2 }}
        >
          <h2 className={styles.title}>সচরাচর জিজ্ঞাসিত প্রশ্নাবলী</h2>
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              className={styles.faqBox}
              whileHover={{ scale: 1.05 }}
              onClick={() => toggleFAQ(index)}
              layout
            >
              <motion.div className={styles.faqQuestion}>
                <span>{item.question}</span>
                <motion.span
                  className={styles.arrow}
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </motion.div>
              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    className={styles.faqAnswer}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FAQ;