"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../cafe.css";
import "./about.css";
import "./responsive.css";
import { interpolate } from "@/app/utils/lib";

export default function AboutPage() {
  const router = useRouter();
 const journeyCards = useMemo(
  () => [
    {
      title: "Early Days",
      front: "Where it all began...",
      back: "I started programming {time.coding} years ago, and I’ve loved it ever since!",
    },
    {
      title: "Career Path",
      front: "Professional growth...",
      back: "I graduated in {time.graduation} and am currently attending college, majoring in English with minors in French and Music. I'm working toward becoming a French teacher!",
    },
    {
      title: "My Life",
      front: "Who am I...",
      back: "I'm Juliette. I love programming, playing instruments, speed-solving, and learning French. I'm {time.age} years old, play {instruments} instruments, and am always learning more!",
    },
  ],
  []
);


  return (
    <div className="cafe-container">
      <div className="cafe-background">
        <div className="floating-elements">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">⭐</div>
          <div className="sparkle sparkle-3">💫</div>
        </div>
      </div>

      <header className="cafe-header">
        <button onClick={() => router.push("/cafe")} className="back-btn">
          <svg
            className="back-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Café
        </button>
        <h1 className="cafe-title">About Me</h1>
      </header>

      <main className="about-content">
        <section className="profile-polaroid">
          <div className="polaroid-inner">
            <div className="polaroid-image">
              <div className="profile-avatar">
                <Image
                  className="rounded-lg"
                  width={250}
                  height={300}
                  src={
                    "https://japi.rest/discord/v1/user/606279329844035594/avatar?size=2048"
                  }
                  alt="Profile Picture"
                />
              </div>
            </div>
            <div className="polaroid-caption">
              <h2 className="profile-name">Juliette</h2>
              <p className="profile-title">Full Stack Developer</p>
              <div className="profile-location">
                <span className="location-icon">📍</span>
                The Moon
              </div>
            </div>
          </div>
          <div className="polaroid-tape polaroid-tape-left" />
          <div className="polaroid-tape polaroid-tape-right" />
        </section>

        <section className="bulletin-board">
          <div className="board-header">
            <h2>My Journey</h2>
            <div className="pushpin pushpin-red" />
            <div className="pushpin pushpin-blue" />
          </div>

          <div className="journey-cards">
            {journeyCards.map((card, index) => {
             
              return (
                <button
                  key={index}
                  className={`journey-card`}
                >
                  <div className="card-inner">
                    <div className="card-front">
                      <div className="card-title">{card.title}</div>
                      <div className="card-content">{interpolate(card.back)}</div>
                    </div>
                  </div>
                  <div className="pushpin pushpin-yellow" />
                </button>
              );
            })}
          </div>
        </section>

        <section className="coffee-note">
          <div className="coffee-stain" />
          <div className="note-content">
            <h3>My Philosophy</h3>
            <p>Build often. Ship sometimes. Learn always.</p>
          </div>
          <div className="note-tape note-tape-left" />
          <div className="note-tape note-tape-right" />
        </section>
      </main>
    </div>
  );
}
