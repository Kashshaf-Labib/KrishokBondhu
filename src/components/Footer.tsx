"use client";

import { motion } from "framer-motion";
import styles from "../app/styles/Footer.module.css";

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.3,
    },
  },
};

const Footer = () => {
  return (
    <motion.footer
      className={styles.footer}
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.footerContainer}>
        {/* Punchline Section */}
        <motion.div className={styles.punchline} whileHover={{ scale: 1.1 }}>
          <h3>বুদ্ধিমত্তার মাধ্যমে কৃষির লালন</h3>
          <p>
            টেকসই ভবিষ্যতের জন্য কৃষকদের এআই-চালিত সমাধান সহায়তা প্রদান
          </p>
        </motion.div>

        {/* Social Media Icons */}
        <motion.div
          className={styles.socialIcons}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 1 } }}
        >
          <motion.a
            href="https://www.facebook.com"
            target="_blank"
            whileHover={{ scale: 1.2 }}
          >
            <img src="/facebook.svg" alt="ফেসবুক" />
          </motion.a>
          <motion.a
            href="https://www.instagram.com"
            target="_blank"
            whileHover={{ scale: 1.2 }}
          >
            <img src="/instagram.svg" alt="ইনস্টাগ্রাম" />
          </motion.a>
          <motion.a
            href="https://www.twitter.com"
            target="_blank"
            whileHover={{ scale: 1.2 }}
          >
            <img src="/twitter.svg" alt="টুইটার" />
          </motion.a>
          <motion.a
            href="https://www.youtube.com"
            target="_blank"
            whileHover={{ scale: 1.2 }}
          >
            <img src="/youtube.svg" alt="ইউটিউব" />
          </motion.a>
        </motion.div>

        {/* Copyright Info */}
        <motion.div className={styles.copyright}>
          <p>© 2024 Krishokbondhu. All Rights Reserved</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;