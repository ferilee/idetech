"use client";

import React, { useState, useRef, useEffect } from "react";

interface SwipeToStartProps {
  onComplete: () => void;
  text?: string;
}

export default function SwipeToStart({ onComplete, text = "Swipe To Start" }: SwipeToStartProps) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !trackRef.current || !handleRef.current) return;

    const trackWidth = trackRef.current.offsetWidth;
    const handleWidth = handleRef.current.offsetWidth;
    const maxDrag = trackWidth - handleWidth - 8; // 4px padding on each side

    const rect = trackRef.current.getBoundingClientRect();
    let newX = clientX - rect.left - handleWidth / 2;

    if (newX < 4) newX = 4;
    if (newX > maxDrag) newX = maxDrag;

    setDragX(newX);

    if (newX >= maxDrag - 10) {
      setIsDragging(false);
      setDragX(maxDrag);
      onComplete();
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const trackWidth = trackRef.current?.offsetWidth || 0;
    const handleWidth = handleRef.current?.offsetWidth || 0;
    const maxDrag = trackWidth - handleWidth - 8;

    if (dragX < maxDrag - 10) {
      setDragX(4);
    }
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleWindowTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const handleWindowMouseUp = () => handleEnd();
    const handleWindowTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener("mousemove", handleWindowMouseMove);
      window.addEventListener("touchmove", handleWindowTouchMove);
      window.addEventListener("mouseup", handleWindowMouseUp);
      window.addEventListener("touchend", handleWindowTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("touchmove", handleWindowTouchMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
      window.removeEventListener("touchend", handleWindowTouchEnd);
    };
  }, [isDragging, dragX]);

  return (
    <div className="swipe-container">
      <div className="swipe-track" ref={trackRef}>
        <div 
          className="swipe-text"
          style={{ 
            opacity: Math.max(0, 1 - dragX / 150),
            transition: isDragging ? "none" : "opacity 0.3s ease"
          }}
        >
          {text}
        </div>
        <div
          className="swipe-handle"
          ref={handleRef}
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          style={{
            transform: `translateX(${dragX}px)`,
            transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)"
          }}
        >
          <div className="swipe-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
