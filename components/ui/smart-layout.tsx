"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/custom/navbar";
import { Footor } from "@/components/custom/footor";

interface SmartLayoutProps {
  children: React.ReactNode;
}

export function SmartLayout({ children }: SmartLayoutProps) {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
        rootMargin: "0px"
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navbar - positioned based on footer visibility */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-in-out ${
          isFooterVisible
            ? "top-0 left-0 right-0"
            : "bottom-0 left-0 right-0"
        }`}
      >
        <Navbar />
      </div>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <div ref={footerRef} className="w-full">
        <Footor />
      </div>
    </div>
  );
}
