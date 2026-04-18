"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SwipeToStart from "@/components/SwipeToStart";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/login");
  };

  return (
    <main className="splash-wrapper">
      <div className="splash-container">
        <div className="splash-content">
          <div className="splash-header">
            <h1>
              Platform <br />
              Belajar <br />
              <span>IdeTech</span>
            </h1>
            <p>
              Ubah materi jadi petualangan belajar. Konten interaktif, gamifikasi, 
              dan kolaborasi dalam satu alur.
            </p>
            <div className="pagination-dots">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          
          <div className="splash-illustration">
            <Image 
              src="/idetech-hero.png" 
              alt="IdeTech Illustration" 
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        <div className="splash-footer">
          <SwipeToStart onComplete={handleStart} text="Swipe To Start" />
        </div>
      </div>
    </main>
  );
}
