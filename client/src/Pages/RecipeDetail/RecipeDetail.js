import React, { useState, useEffect } from "react";
import "./style.css";
import RecipeModal from "./RecipeModal";

const RecipeDetail = ({ recipe, nutrition, ingredients, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [hintFlip, setHintFlip] = useState(index === 0);

    useEffect(() => {
        if (index !== 0) return;

        const flipTimeout = setTimeout(() => setIsFlipped(true), 1000);
        const flipBackTimeout = setTimeout(() => {
            setIsFlipped(false);
            setHintFlip(false);
        }, 2500);

        return () => {
            clearTimeout(flipTimeout);
            clearTimeout(flipBackTimeout);
        };
    }, [index]);

    if (!recipe) {
        return <div>No recipe data provided</div>;
    }

    const { Recipe, Total_Time, Images, PDF, Meal_Category, Cooking_Difficulty } = recipe;

    return (
        <>
            <div className="flip-container" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`recipe-card ${isFlipped ? "flipped" : ""} ${hintFlip ? "hint-animation" : ""}`}>
                    {/* FRONT SIDE - Recipe Details */}
                    <div className="recipe-card-front">
                        <div className="image-container">
                            <img src={Images} alt={Recipe} className="recipe-image" />
                            <div className="meal-category">{Meal_Category}</div>
                        </div>

                        <div className="recipe-info">
                            <p><span className="meta-icon">⏱</span> {Total_Time}</p>
                            <p><span className="meta-icon">🔥</span> {Cooking_Difficulty}</p>
                            <p className="ingredients-tooltip">
                                <span className="meta-icon">📋</span>
                                {ingredients.length} Ingredients
                                <span className="tooltip-text">
                                    {ingredients.map((ingredient, i) => (
                                        <div key={i}>
                                            {ingredient.Quantity} {ingredient.Unit} {ingredient.Ingredient}
                                        </div>
                                    ))}
                                </span>
                            </p>
                        </div>

                        <h3 className="recipe-title">{Recipe}</h3>

                        <div className="recipe-buttons-wrapper">
                            <div className="recipe-buttons">
                                <button className="view-instructions-button" onClick={(e) => { 
                                    e.stopPropagation();
                                    setShowModal(true);
                                }}>
                                    View Instructions
                                </button>
                                <button 
                                    className="view-recipe-button" 
                                    onClick={(e) => { 
                                        e.stopPropagation();
                                        window.open(PDF, "_blank", "noopener,noreferrer");
                                    }}
                                >
                                    View PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* BACK SIDE - Nutrition Facts */}
                    <div className="recipe-card-back">
                        {nutrition ? (
                            <div className="performance-facts">
                                <header className="performance-facts__header">
                                    <h1 className="performance-facts__title">Nutrition Facts</h1>
                                </header>

                                <table className="performance-facts__table">
                                    <thead>
                                        <tr>
                                            <th colSpan="3" className="small-info">Amount Per Serving</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nutrition.Calories && (
                                            <tr>
                                                <th colSpan="2"><b>Calories</b> {nutrition.Calories}</th>
                                            </tr>
                                        )}
                                        <tr className="thick-row">
                                            <td colSpan="3" className="small-info"><b>% Daily Value*</b></td>
                                        </tr>
                                        {nutrition.Fat && (
                                            <tr>
                                                <th colSpan="2"><b>Total Fat</b> {nutrition.Fat}</th>
                                                <td><b>{Math.round((parseInt(nutrition.Fat) / 65) * 100)}%</b></td>
                                            </tr>
                                        )}
                                        {nutrition['Saturated Fat'] && (
                                            <tr>
                                                <td className="blank-cell"></td>
                                                <th>Saturated Fat {nutrition['Saturated Fat']}</th>
                                                <td><b>{Math.round((parseInt(nutrition['Saturated Fat']) / 20) * 100)}%</b></td>
                                            </tr>
                                        )}
                                        {nutrition.Cholesterol && (
                                            <tr>
                                                <th colSpan="2"><b>Cholesterol</b> {nutrition.Cholesterol}</th>
                                                <td><b>{Math.round((parseInt(nutrition.Cholesterol) / 300) * 100)}%</b></td>
                                            </tr>
                                        )}
                                        {nutrition.Sodium && (
                                            <tr>
                                                <th colSpan="2"><b>Sodium</b> {nutrition.Sodium}</th>
                                                <td><b>{Math.round((parseInt(nutrition.Sodium) / 2400) * 100)}%</b></td>
                                            </tr>
                                        )}
                                        {nutrition.Carbohydrate && (
                                            <tr>
                                                <th colSpan="2"><b>Total Carbohydrate</b> {nutrition.Carbohydrate}</th>
                                                <td><b>{Math.round((parseInt(nutrition.Carbohydrate) / 300) * 100)}%</b></td>
                                            </tr>
                                        )}
                                        {nutrition.Protein && (
                                            <tr className="thick-end">
                                                <th colSpan="2"><b>Protein</b> {nutrition.Protein}</th>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <p className="small-info">* Percent Daily Values are based on a 2,000 calorie diet.</p>
                                <p className="flip-instruction">(Click to flip back)</p>
                            </div>
                        ) : (
                            <p>No nutrition data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Show modal when triggered */}
            {showModal && <RecipeModal recipe={recipe} onClose={() => setShowModal(false)} />}
        </>
    );
};

export default RecipeDetail;
