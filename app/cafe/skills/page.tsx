"use client";

import { useState, useEffect } from "react";
import "../cafe.css";
import "./skills.css";
import "./responsive.css"
import { skillRecipes } from "./skills";

export default function SkillsPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRecipeClick = (recipeId: number) => {
    setSelectedRecipe(selectedRecipe === recipeId ? null : recipeId);
  };

  return (
    <div className="skills-page">
      
      <div className="skills-background">
        <div className="floating-utensils">
          <div className="bg-utensil utensil-1">🥄</div>
          <div className="bg-utensil utensil-2">🍴</div>
          <div className="bg-utensil utensil-3">🔪</div>
          <div className="bg-utensil utensil-4">🥄</div>
        </div>
        <div className="flour-dust">
          <div className="dust dust-1"></div>
          <div className="dust dust-2"></div>
          <div className="dust dust-3"></div>
        </div>
      </div>

      
      <header className="skills-header">
        <button
          onClick={() => (window.location.href = "/cafe")}
          className="back-btn"
        >
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
        <h1 className="skills-title">My Recipe Collection</h1>
        <p className="skills-subtitle">
          Time-tested skills perfected through practice
        </p>
      </header>

      
      <main className="recipe-cards-container">
        <div className="recipe-cards">
          {skillRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className={`recipe-card ${
                selectedRecipe === recipe.id ? "selected" : ""
              }`}
              onClick={() => handleRecipeClick(recipe.id)}
            >
              
              <div className="index-card horizontal">
                
                <div className="card-holes horizontal">
                  <div className="hole hole-1"></div>
                  <div className="hole hole-2"></div>
                  <div className="hole hole-3"></div>
                </div>

                
                <div className="margin-line horizontal"></div>

                
                <div className="ruled-lines horizontal">
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                </div>

                
                <div className="card-content horizontal">
                  
                  <div className="card-left">
                    <div className="recipe-emoji">{recipe.emoji}</div>
                    <div className="recipe-header-info">
                      <h3 className="recipe-title">{recipe.title}</h3>
                      <p className="recipe-category">{recipe.category}</p>
                      <div className="recipe-meta">
                        <div className="meta-item">
                          <span className="meta-label">Experience: </span>
                          <span className="meta-value">
                            {recipe.cookingTime}
                          </span>
                        </div>
                        <div className="tap-hint">tap for full recipe</div>
                      </div>
                    </div>
                  </div>

                  
                  <div className="card-right">
                    <div className="recipe-description">
                      {recipe.description}
                    </div>

                    <div className="ingredients-preview">
                      <h4>Key Skills:</h4>
                      <div className="ingredient-grid">
                        {recipe.ingredients
                          .slice(0, 6)
                          .map((ingredient, index) => (
                            <div key={index} className="ingredient-item">
                              • {ingredient.name}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        
        {selectedRecipe && (
          <div
            className={`modal-overlay ${isMobile ? "mobile-drawer" : ""}`}
            onClick={() => setSelectedRecipe(null)}
          >
            <div
              className={`modal-content ${isMobile ? "drawer-content" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const recipe = skillRecipes.find(
                  (r) => r.id === selectedRecipe
                );
                return recipe ? (
                  <div className="recipe-modal">
                    <div className="modal-header">
                      <div className="recipe-emoji-large">{recipe.emoji}</div>
                      <div className="recipe-title-section">
                        <h3 className="recipe-name">{recipe.title}</h3>
                        <p className="recipe-category-full">
                          {recipe.category}
                        </p>
                      </div>
                      <button
                        className="close-modal"
                        onClick={() => setSelectedRecipe(null)}
                      >
                        x
                      </button>
                    </div>

                    <div className="modal-body">
                      <div className="recipe-stats">
                        <div className="stat">
                          <span className="stat-label">Experience</span>
                          <span className="stat-value">
                            {recipe.cookingTime}
                          </span>
                        </div>
                      </div>

                      <div className="recipe-description-section">
                        <p className="recipe-full-description">
                          {recipe.description}
                        </p>
                      </div>

                      <div className="skills-section">
                        <h4>Skills & Technologies</h4>
                        <div className="skills-list">
                          {recipe.ingredients.map((ingredient, index) => (
                            <div key={index} className="skill-item">
                              <span className="skill-name">
                                {ingredient.name}
                              </span>
                              <span
                                className={`proficiency-level level-${ingredient.amount.toLowerCase()}`}
                              >
                                {ingredient.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
