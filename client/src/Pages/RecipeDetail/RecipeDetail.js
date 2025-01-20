import React, { useState } from "react";
import "../Home/style.css";
import "./style.css";

const RecipeDetail = ({ recipe, nutrition, ingredients, instructions }) => {
    const [flipped, setFlipped] = useState(false);

    if (!recipe) {
        return <div>No recipe data provided</div>;
    }

    const { Recipe, Total_Time, Images, PDF, Meal_Category, Cooking_Difficulty } = recipe;

    return (
        <div className={`featured-recipe-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
            <div className="featured-recipe-inner">
                {/* Front Side - Recipe Details */}
                <div className="featured-recipe-front">
                    <div className="featured-recipe-image-container">
                        <img src={Images} alt={Recipe} className="featured-recipe-image" />
                        <div className="featured-recipe-overlay">
                            <p className="featured-recipe-header">{Meal_Category}</p>
                        </div>
                    </div>
                    <div className="featured-recipe-content">
                        <h2 className="featured-recipe-title">{Recipe}</h2>

                        {/* Meta Info on a Single Line */}
                        <div className="featured-recipe-meta">
                            <p><span className="meta-icon">⏱</span> {Total_Time} min</p>
                            <p><span className="meta-icon">🔥</span> {Cooking_Difficulty}</p>
                            <p className="ingredients-tooltip">
                                <span className="meta-icon">📋</span> {ingredients.length} Ingredients
                                <span className="tooltip-text">
                                    {ingredients.map((ingredient, index) => (
                                        <div key={index}>
                                            {ingredient.Quantity} {ingredient.Unit} {ingredient.Ingredient}
                                        </div>
                                    ))}
                                </span>
                            </p>
                        </div>

                        {/* Cooking Instructions with One Bullet Per Step */}
                        {instructions && instructions.length > 0 ? (
                            <div className="recipe-instructions">
                                <h4>Instructions</h4>
                                <ul className="instruction-list">
                                    {instructions
                                        .sort((a, b) => a.sub_index - b.sub_index)
                                        .map((instruction, index) => (
                                            <li key={index} className="instruction-step">
                                                • {instruction.Step} {instruction.instruction}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No instructions available</p>
                        )}

                        <a href={PDF} target="_blank" rel="noopener noreferrer" className="view-recipe-button">
                            View Recipe
                        </a>
                    </div>
                </div>

                {/* Back Side - Fully Restored Nutrition Facts */}
                <div className="featured-recipe-back">
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
                                            <th colSpan="2"><b>Total Fat</b> {nutrition.Fat}g</th>
                                            <td><b>{Math.round((parseInt(nutrition.Fat) / 65) * 100)}%</b></td>
                                        </tr>
                                    )}
                                    {nutrition['Saturated Fat'] && (
                                        <tr>
                                            <td className="blank-cell"></td>
                                            <th>Saturated Fat {nutrition['Saturated Fat']}g</th>
                                            <td><b>{Math.round((parseInt(nutrition['Saturated Fat']) / 20) * 100)}%</b></td>
                                        </tr>
                                    )}
                                    {nutrition.Cholesterol && (
                                        <tr>
                                            <th colSpan="2"><b>Cholesterol</b> {nutrition.Cholesterol}mg</th>
                                            <td><b>{Math.round((parseInt(nutrition.Cholesterol) / 300) * 100)}%</b></td>
                                        </tr>
                                    )}
                                    {nutrition.Sodium && (
                                        <tr>
                                            <th colSpan="2"><b>Sodium</b> {nutrition.Sodium}mg</th>
                                            <td><b>{Math.round((parseInt(nutrition.Sodium) / 2400) * 100)}%</b></td>
                                        </tr>
                                    )}
                                    {nutrition.Carbohydrate && (
                                        <tr>
                                            <th colSpan="2"><b>Total Carbohydrate</b> {nutrition.Carbohydrate}g</th>
                                            <td><b>{Math.round((parseInt(nutrition.Carbohydrate) / 300) * 100)}%</b></td>
                                        </tr>
                                    )}
                                    {nutrition.Protein && (
                                        <tr className="thick-end">
                                            <th colSpan="2"><b>Protein</b> {nutrition.Protein}g</th>
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
    );
};

export default RecipeDetail;
