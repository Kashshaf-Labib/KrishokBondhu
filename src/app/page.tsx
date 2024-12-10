"use client"; 
import React, { useRef } from "react";
import HeroSection from "../components/HeroSection";
import FeatureSlider from "../components/FeatureSlider";
import SlidingBar from "@/components/SlidingBar";
import FAQ from "@/components/faq";


export default function Home() {
  const featureSliderRef = useRef<HTMLDivElement | null>(null);

  const scrollToFeatures = () => {
    if (featureSliderRef.current) {
      featureSliderRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <HeroSection onExploreClick={scrollToFeatures} />
      <SlidingBar />
      <div ref={featureSliderRef}>
        <FeatureSlider />
      </div>
      <FAQ />
      
    </>
  );
}
