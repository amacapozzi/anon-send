"use client";
import { useEffect, useState } from "react";
import { sliderImages } from "@/consts/slider";
import { ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";
import Link from "next/link";

interface AuthSliderProps {
  sliderInterval: number;
}

export const AuthSlider = ({ sliderInterval }: AuthSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = sliderImages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, sliderInterval);

    return () => clearInterval(interval);
  }, [slideCount]);

  return (
    <div className="relative hidden md:flex md:w-1/2 flex-col">
      <div className="absolute inset-0 overflow-hidden">
        {sliderImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Slide ${idx}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              currentSlide === idx ? "opacity-60" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Logo and back button */}
      <div className="relative z-10 flex justify-between items-center p-8">
        <Link href="/" className="flex items-centere hover:underline">
          <Badge className="py-1 text-white text-sm rounded-full bg-white/20 px-3">
            Back to website <ArrowRight className="ml-1 h-4 w-4" />
          </Badge>
        </Link>
      </div>

      <div className="relative z-10 mt-auto mx-auto p-8 mb-12">
        <h2 className="text-white text-3xl text-center font-bold leading-tight">
          Capturing Moments,
          <br />
          Creating Memories
        </h2>

        {/* Pagination dots */}
        <div className="flex justify-center mt-8 space-x-2">
          <div className="flex justify-center mt-8 space-x-2">
            {sliderImages.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-6 h-1 rounded-full cursor-pointer transition-all duration-300 ${
                  currentSlide === idx ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
