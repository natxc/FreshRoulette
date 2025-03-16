import React, { useState, useEffect } from "react";
import "./style.css";
import RecipeModal from "./RecipeModal";

const RecipeDetail = ({ recipe, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [hintFlip] = useState(index === 0);

    return (
        <>
            <div className="flip-container" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`recipe-card ${isFlipped ? "flipped" : ""} ${hintFlip ? "hint-animation" : ""}`}>
                    {/* FRONT SIDE - Recipe Details */}
                    <div className="recipe-card-front">
                        <img src={recipe.image} alt={recipe.name} className="recipe-image" />

                        <div className="meal-category">{recipe.category}</div>

                        <div className="recipe-info">
                            <p><strong>Cooking Time:</strong> {recipe.cookingTime} min</p>
                            <p><strong>Total Time:</strong> {recipe.totalTime} min</p>
                            <p><strong>Ingredients:</strong> {recipe.ingredients.length}</p>
                        </div>

                        <h3 className="recipe-title">{recipe.name}</h3>

                        <div className="recipe-buttons">
                            <a href={recipe.pdf} target="_blank" rel="noopener noreferrer" className="view-recipe-button">
                                View Recipe
                            </a>
                            <button className="view-instructions-button" onClick={(e) => { 
                                e.stopPropagation(); // Prevent flipping when clicking button
                                setShowModal(true);
                            }}>
                                View Instructions
                            </button>
                        </div>
                    </div>

                    {/* BACK SIDE - Nutrition Facts */}
                    <div className="recipe-card-back">
                        <h3>Nutrition Facts</h3>
                        <p><strong>Calories:</strong> {recipe.nutrition.calories}</p>
                        <p><strong>Protein:</strong> {recipe.nutrition.protein}g</p>
                        <p><strong>Carbs:</strong> {recipe.nutrition.carbs}g</p>
                        <p><strong>Fat:</strong> {recipe.nutrition.fat}g</p>
                        <p><strong>Fiber:</strong> {recipe.nutrition.fiber}g</p>
                        <p className="flip-text">(Click to flip back)</p>
                    </div>
                </div>
            </div>

            {/* Show modal when triggered */}
            {showModal && <RecipeModal recipe={recipe} onClose={() => setShowModal(false)} />}
        </>
    );
};

export default RecipeDetail;