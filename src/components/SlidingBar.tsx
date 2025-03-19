"use client";
import React from "react";
import styles from "@/app/styles/SlidingBar.module.css";

const plantDiseaseIcon = "/plant-disease-icon.png";
const fertilizerSuggestionIcon = "/fertilizer-suggestion-icon.png";
const soilSuggestionIcon = "/soil-suggestion-icon.png";
const expertConsultIcon = "/expert-consult-icon.png";
const pestControlIcon = "/pest-control-icon.png";
const verticalFarmingIcon = "/vertical-farming-icon.svg";

const SlidingBar = () => {
  return (
    <div className={styles.slidingBar}>
      <div className={styles.slidingBarContent}>
        <div className={styles.slidingItem}>
          <img src={plantDiseaseIcon} alt="উদ্ভিদ রোগ সনাক্তকরণ" />
          উদ্ভিদ রোগ সনাক্তকরণ
        </div>
        <div className={styles.slidingItem}>
          <img src={fertilizerSuggestionIcon} alt="সার সুপারিশ" />
          সার সুপারিশ
        </div>
        <div className={styles.slidingItem}>
          <img src={soilSuggestionIcon} alt="মাটি সুপারিশ" />
          মাটি সুপারিশ
        </div>
        <div className={styles.slidingItem}>
          <img src={expertConsultIcon} alt="বিশেষজ্ঞ পরামর্শ" />
          বিশেষজ্ঞ পরামর্শ
        </div>
        <div className={styles.slidingItem}>
          <img src={pestControlIcon} alt="পোকা নিয়ন্ত্রণ" />
          পোকা নিয়ন্ত্রণ
        </div>
        <div className={styles.slidingItem}>
          <img src={verticalFarmingIcon} alt="উল্লম্ব চাষাবাদ সমাধান" />
          ভার্টিক্যাল চাষাবাদ সমাধান
        </div>
      </div>
    </div>
  );
};

export default SlidingBar;