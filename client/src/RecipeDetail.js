import React from "react";
import "./App.css";
import "./RecipeDetail.css"

const RecipeDetail = ({ recipe, nutrition, ingredients, instructions }) => {
    if (!recipe) {
        return <div>No recipe data provided</div>;
    }

    const {
        Recipe,
        Meal_Category,
        // Link,
        Images,
        Total_Time,
        Cooking_Difficulty,
        PDF,
    } = recipe;

    return (
        <div className="recipe-card">
                <a href={PDF} target="_blank" rel="noopener noreferrer">
                    <img
                        src={Images}
                        alt={Recipe}
                        className="recipe-detail-image"
                    />
                </a>
            <div className="recipe-details">
                <h4>{Recipe}</h4>
                <p>{Meal_Category}</p>
                <p>{Total_Time}</p>
                <p>{Cooking_Difficulty}</p>

                {/* Display Nutrition Facts */}
                {nutrition ? (
                    <div className="performance-facts">
                        <header className="performance-facts__header">
                            <h1 className="performance-facts__title">Nutrition Facts</h1>
                        </header>

                        <table className="performance-facts__table">
                            <thead>
                                <tr>
                                    <th colSpan="3" className="small-info">
                                        Amount Per Serving
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {nutrition.Calories && (
                                    <tr>
                                        <th colSpan="2">
                                            <b>Calories </b>
                                            {nutrition.Calories}
                                        </th>
                                        <td>
                                            <br></br>
                                        </td>
                                    </tr>
                                )}
                                <tr className="thick-row">
                                    <td colSpan="3" className="small-info">
                                        <b>% Daily Value*</b>
                                    </td>
                                </tr>
                                {nutrition.Fat && (
                                    <tr>
                                        <th colSpan="2">
                                            <b>Total Fat </b>
                                            {nutrition.Fat}
                                        </th>
                                        <td>
                                            <b>{Math.round((parseInt(nutrition.Fat) / 65) * 100)}%</b>
                                        </td>
                                    </tr>
                                )}
                                {nutrition['Saturated Fat'] && (
                                    <tr>
                                        <td className="blank-cell"></td>
                                        <th>
                                            Saturated Fat {' '}
                                            {nutrition['Saturated Fat']}
                                        </th>
                                        <td>
                                            <b>{Math.round((parseInt(nutrition['Saturated Fat']) / 20) * 100)}%</b>
                                        </td>
                                    </tr>
                                )}
                                {nutrition.Cholesterol && (
                                    <tr>
                                        <th colSpan="2">
                                            <b>Cholesterol </b>
                                            {nutrition.Cholesterol}
                                        </th>
                                        <td>
                                            <b>{Math.round((parseInt(nutrition.Cholesterol) / 300) * 100)}%</b>
                                        </td>
                                    </tr>
                                )}
                                {nutrition.Sodium && (
                                    <tr>
                                        <th colSpan="2">
                                            <b>Sodium </b>
                                            {nutrition.Sodium}
                                        </th>
                                        <td>
                                            <b>{Math.round((parseInt(nutrition.Sodium) / 2400) * 100)}%</b>
                                        </td>
                                    </tr>
                                )}
                                {nutrition.Carbohydrate && (
                                    <tr>
                                        <th colSpan="2">
                                            <b>Total Carbohydrate </b>
                                            {nutrition.Carbohydrate}
                                        </th>
                                        <td>
                                            <b>{Math.round((parseInt(nutrition.Carbohydrate) / 300) * 100)}%</b>
                                        </td>
                                    </tr>
                                )}
                                {nutrition['Dietary Fiber'] && (
                                    <tr>
                                        <td className="blank-cell"></td>
                                        <th>
                                            Dietary Fiber {' '}
                                            {nutrition['Dietary Fiber']}
                                        </th>
                                        <td>
                                            <b>{Math.round((parseInt(nutrition['Dietary Fiber']) / 25) * 100)}%</b>
                                        </td>
                                    </tr>
                                )}
                                {nutrition.Sugar && (
                                    <tr>
                                        <td className="blank-cell"></td>
                                        <th>
                                            Sugars {' '}
                                            {nutrition.Sugar}
                                        </th>
                                        <td>
                                            <br></br>
                                        </td>
                                    </tr>
                                )}
                                {nutrition['Energy(kJ)'] && (
                                    <tr>
                                        <th colSpan="2">
                                            <b>Energy (kJ) </b>
                                            {nutrition['Energy(kJ)']}
                                        </th>
                                        <td>
                                            <b>{Math.round((parseInt(nutrition['Energy (kJ']) / 8400) * 100)}%</b>
                                        </td>
                                    </tr>
                                )}
                                <tr className="thick-end">
                                    <th colSpan="2">
                                        <b>Protein </b>
                                        {nutrition.Protein}
                                    </th>
                                    <td>
                                        <br></br>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <p className="small-info">* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs:</p>

                    </div>
                ) : (
                    <p>No nutrition data available</p>
                )}

                {/* Display Ingredients */}
                {ingredients && ingredients.length > 0 ? (
                    <div>
                        <h4>Ingredients</h4>
                        <ul>
                            {ingredients.map((ingredient, index) => (
                                <li key={index}>
                                    {ingredient.Quantity} {ingredient.Unit} {ingredient.Ingredient}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No ingredients data available</p>
                )}

                {/* Display Cooking Instructions */}
                {instructions && instructions.length > 0 ? (
                    <div>
                        <h4>Instructions</h4>
                        <ul>
                            {instructions
                                .sort((a, b) => a.sub_index - b.sub_index)
                                .map((instruction, index) => (
                                    <li key={index}>
                                        {instruction.Step} {instruction.instruction}
                                    </li>
                                ))}
                        </ul>
                    </div>
                ) : (
                    <p>No instructions data available</p>
                )}
            </div>
        </div>
    );
};

export default RecipeDetail;
