"use client";

import { Navbar } from "@/components/custom/navbar";
import { Hero } from "@/components/custom/hero";
import { Footor } from "@/components/custom/footor";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* <BackgroundRippleEffect /> */}
      <Hero />
      <div className="w-full">
        <Footor />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navbar />
      </div>
    </div>
  );
}