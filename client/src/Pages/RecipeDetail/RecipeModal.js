import React from "react";
import "./style.css";

const RecipeModal = ({ recipe, onClose }) => {
    if (!recipe) return null;

    const { Recipe, Total_Time, Images, Cooking_Difficulty } = recipe;

    return (
        <div className="modal-overlay">
            <div className="modal-container">

                <button className="modal-close" onClick={onClose}>✕</button>

                <img src={Images} alt={Recipe} className="modal-image" />

                <h2 className="modal-title">{Recipe}</h2>

                <div className="modal-info">
                    <p><span className="meta-icon">⏱</span> {Total_Time} min</p>
                    <p><span className="meta-icon">🔥</span> {Cooking_Difficulty}</p>
                    <p className="ingredients-tooltip">
                    <span className="meta-icon">📋</span>
                        {recipe.ingredients.length} Ingredients
                        <span className="tooltip-text">
                        {recipe.ingredients.map((ingredient, index) => (
                            <div key={index}>
                                {ingredient.Quantity} {ingredient.Unit} {ingredient.Ingredient}
                            </div>
                        ))}
                    </span></p>
                </div>

                <h3 className="modal-instructions-heading">Instructions</h3>
                <div className="modal-instructions">
                    {Array.isArray(recipe.instructions) ? (
                        <ul>
                            {recipe.instructions.map((step, index) => (
                                <li key={step.uuid || index}>{step.Step}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>{recipe.instructions}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeModal;
