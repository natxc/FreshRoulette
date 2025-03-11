import React from "react";
import { useLocation, Link } from "react-router-dom";
import RecipeDetail from "../RecipeDetail/RecipeDetail";

const ReviewMenu = () => {
    const location = useLocation();
    const lockedMeals = location.state?.lockedMeals || [];

    console.log("Locked Meals Data:", lockedMeals); // Debugging

    return (
        <div className="review-container">
            <h2>Review Your Menu</h2>
            <p>Here are your locked-in meals for the week.</p>

            <div className="meal-list">
                {lockedMeals.length > 0 ? (
                    lockedMeals.map((meal, index) => (
                        <RecipeDetail
                            key={meal.uuid || index} // Ensure a unique key
                            recipe={meal}
                            nutrition={meal.Nutrition}
                            ingredients={meal.Ingredients || []}
                            instructions={meal.Instructions || []}
                        />
                    ))
                ) : (
                    <p>No meals selected.</p>
                )}
            </div>


            <Link to="/grocery-list">
                <button className="generate-list-button">Generate Grocery List</button>
            </Link>
        </div>
    );
};

export default ReviewMenu;