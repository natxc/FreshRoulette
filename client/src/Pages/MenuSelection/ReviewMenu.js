import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import RecipeDetail from "../RecipeDetail/RecipeDetail";

const ReviewMenu = () => {
    const location = useLocation();
    const lockedMealUUIDs = useMemo(() => location.state?.lockedMeals || [], [location.state]);
    const [lockedMeals, setLockedMeals] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            if (lockedMealUUIDs.length === 0) {
                return;
            }

            try {
                const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://freshroulette.app";
                const recipePromises = lockedMealUUIDs.map(uuid => axios.get(`${API_BASE_URL}/recipes/${uuid}`));

                const recipes = await Promise.all(recipePromises);
                setLockedMeals(recipes.map(res => res.data));
            } catch (error) {
            }
        };

        fetchRecipes();
    }, [lockedMealUUIDs]);

    const goToGroceryList = () => {
        if (lockedMeals.length > 0) {
            localStorage.setItem("groceryListData", JSON.stringify(lockedMeals));
        }

        window.open("/grocery-list", "_blank");
    };

    return (
        <div className="menu-container">
            <div className="menu-header">
                <h2 className="menu-title">This week's menu</h2>
                <button className="generate-list-button" onClick={goToGroceryList}>
                    View Grocery List
                </button>
            </div>


            <div className="meal-list">
                {lockedMeals.map((meal, index) => (
                    <RecipeDetail
                        key={meal.uuid || index}
                        recipe={meal}
                        nutrition={meal.nutrition}
                        ingredients={meal.ingredients}
                        instructions={meal.instructions}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewMenu;