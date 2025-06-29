"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import "./cafe.css";
import "./animations.css"
import "./responsive.css"

type PortfolioItem = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  route: string;
  available: boolean;
};

const portfolioItems: PortfolioItem[] = [
  {
    id: "about",
    name: "About",
    emoji: "🥞",
    description: "Learn about my journey",
    route: "/cafe/about",
    available: true,
  },
  {
    id: "projects",
    name: "Projects",
    emoji: "🧁",
    description: "Explore my work",
    route: "/cafe/projects",
    available: true,
  },
  {
    id: "skills",
    name: "Skills",
    emoji: "🍪",
    description: "Discover my abilities",
    route: "/cafe/skills",
    available: true,
  },
  {
    id: "contact",
    name: "Contact",
    emoji: "🥐",
    description: "Get in touch with me",
    route: "/cafe/contact",
    available: false,
  },
  {
    id: "experience",
    name: "Experience",
    emoji: "🍩",
    description: "Coming Soon",
    route: "#",
    available: false,
  },

  {
    id: "blog",
    name: "Blog",
    emoji: "🧇",
    description: "Coming Soon",
    route: "#",
    available: false,
  },
];

const posterData = [
  {
    id: 1,
    title: "New Dessert!",
    emoji: "🍮",
    subtitle: "Crème Brûlée",
    description: "Silky smooth vanilla custard with caramelized sugar",
    alert:
      "🍮 New Dessert Alert!\n\nOur chef has crafted a delicious Crème Brûlée with silky smooth vanilla custard and perfectly caramelized sugar. Available now!",
  },
  {
    id: 2,
    title: "Café Français",
    emoji: "🇫🇷",
    subtitle: "Learn French",
    description: "Join our friendly conversation group",
    alert:
      "🇫🇷 Café Français!\n\nJoin our friendly French conversation group. Perfect for beginners who want to practice in a relaxed café setting. Bring your curiosity and we'll provide the coffee!",
  },
  {
    id: 3,
    title: "Art Exhibition",
    emoji: "🎨",
    subtitle: "Local Artists",
    description: "Featuring works from neighborhood creators",
    alert:
      "🎨 Art Exhibition!\n\nDiscover amazing works from talented local artists. The exhibition features paintings, sculptures, and digital art from our neighborhood creative community.",
  },
  {
    id: 4,
    title: "Live Music",
    emoji: "🎵",
    subtitle: "Jazz Night",
    description: "Smooth jazz every Friday evening",
    alert:
      "🎵 Live Music!\n\nJoin us for smooth jazz every Friday evening. Local musicians create the perfect ambiance for a relaxing night out with friends.",
  },
  {
    id: 5,
    title: "Book Club",
    emoji: "📚",
    subtitle: "Monthly Reads",
    description: "Discussing contemporary fiction",
    alert:
      "📚 Book Club!\n\nOur monthly book club meets to discuss contemporary fiction. This month we're reading 'The Seven Husbands of Evelyn Hugo'. All readers welcome!",
  },
  {
    id: 6,
    title: "Coffee Tasting",
    emoji: "☕",
    subtitle: "Bean Origins",
    description: "Explore flavors from around the world",
    alert:
      "☕ Coffee Tasting!\n\nExplore coffee flavors from around the world. Learn about different bean origins, roasting techniques, and brewing methods from our expert baristas.",
  },
];

export default function CafePage() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const router = useRouter();

  const handleMouseEnter = useCallback((id: string) => setHoveredItem(id), []);
  const handleMouseLeave = useCallback(() => setHoveredItem(null), []);

  const handleItemClick = useCallback(
    (item: PortfolioItem) => {
      if (item.available) {
        router.push(item.route);
      }
    },
    [router]
  );

  const handlePosterClick = useCallback((poster: (typeof posterData)[0]) => {
    const posterElement = document.querySelector(`.poster-${poster.id}`);
    posterElement?.classList.add("poster-clicked");
    setTimeout(() => posterElement?.classList.remove("poster-clicked"), 300);
  }, []);

  const renderedItems = useMemo(
    () =>
      portfolioItems.map((item) => (
        <div
          key={item.id}
          className={`menu-item ${hoveredItem === item.id ? "hovered" : ""} ${
            !item.available ? "coming-soon" : ""
          }`}
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleItemClick(item)}
        >
          <div className="item-emoji">{item.emoji}</div>
          <div className="item-details">
            <h3 className="item-name">{item.name}</h3>
            <p className="item-description">{item.description}</p>
          </div>
          <div className="item-hover-effect"></div>
          <div className="item-sparkles">
            <span className="mini-sparkle">✨</span>
            <span className="mini-sparkle">⭐</span>
            <span className="mini-sparkle">💫</span>
          </div>
          {!item.available && <div className="coming-soon-overlay">🚧</div>}
        </div>
      )),
    [hoveredItem, handleMouseEnter, handleMouseLeave, handleItemClick]
  );

  return (
    <div className="cafe-container">
      <div className="cafe-background">
        <div className="posters">
          {posterData.map((poster) => (
            <div
              key={poster.id}
              className={`poster poster-${poster.id}`}
              onClick={() => handlePosterClick(poster)}
            >
              <div className="tape-bottom-left"></div>
              <div className="tape-bottom-right"></div>
              <div className="poster-title">{poster.title}</div>
              <div className="poster-content">
                <span className="poster-emoji">{poster.emoji}</span>
                <div className="poster-subtitle">{poster.subtitle}</div>
                <div className="poster-description">{poster.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="floating-elements">
        <div className="sparkle sparkle-1">✨</div>
        <div className="sparkle sparkle-2">⭐</div>
        <div className="sparkle sparkle-3">💫</div>
        <div className="sparkle sparkle-4">✨</div>
        <div className="sparkle sparkle-5">⭐</div>
      </div>

      <header className="cafe-header">
        <h1 className="cafe-title">My Café</h1>
      </header>

      <main className="menu-section">
        <div className="menu-board">
          <h2 className="menu-title">Pancakes Menu</h2>
          <div className="menu-grid">{renderedItems}</div>
        </div>
      </main>
    </div>
  );
}
