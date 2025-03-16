import React from "react";
import "./style.css";

const RecipeModal = ({ recipe, onClose }) => {
    if (!recipe) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {/* Close button */}
                <button className="modal-close" onClick={onClose}>✕</button>

                {/* Recipe Image */}
                <img src={recipe.image} alt={recipe.name} className="modal-image" />

                {/* Recipe Title */}
                <h2 className="modal-title">{recipe.name}</h2>

                {/* Cooking Info */}
                <div className="modal-info">
                    <p><strong>Time:</strong> {recipe.totalTime} min</p>
                    <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                    <p><strong>Ingredients:</strong> {recipe.ingredients.length}</p>
                </div>

                {/* Instructions Heading */}
                <h3 className="modal-instructions-heading">Instructions</h3>
                <div className="modal-instructions">
                    {Array.isArray(recipe.instructions) ? (
                        <ol>
                            {recipe.instructions.map((step, index) => (
                                <li key={step.uuid || index}>{step.Step}</li>
                            ))}
                        </ol>
                    ) : (
                        <p>{recipe.instructions}</p> // If it's just a string, render normally
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeModal;
