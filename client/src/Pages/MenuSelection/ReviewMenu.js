import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import RecipeDetail from "../RecipeDetail/RecipeDetail";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:9001";

const ReviewMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const lockedMealUUIDs = useMemo(() => location.state?.lockedMeals || [], [location.state]);

    const [lockedMeals, setLockedMeals] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            if (lockedMealUUIDs.length === 0) {
                return;
            }

            try {
                const recipePromises = lockedMealUUIDs.map(uuid => axios.get(`${API_BASE_URL}/recipes/${uuid}`));
                const recipes = await Promise.all(recipePromises);

                setLockedMeals(recipes.map(res => res.data));
            } catch (error) {
            }
        };

        fetchRecipes();
    }, [lockedMealUUIDs]);

    const goToGroceryList = () => {
        navigate("/grocery-list", { state: { recipes: lockedMeals } });
    };

    return (
        <div className="menu-container">
            <h2>Review Your Menu</h2>
            <p>Here are your locked-in meals for the week.</p>

            <div className="meal-list">
                {lockedMeals.length > 0 ? (
                    lockedMeals.map((meal, index) => (
                        <RecipeDetail
                            key={meal.uuid || index}
                            recipe={meal}
                            nutrition={meal.nutrition}
                            ingredients={meal.ingredients}
                            instructions={meal.instructions}
                        />
                    ))
                ) : (
                    <p>No meals selected.</p>
                )}
            </div>

            <button className="generate-list-button" onClick={goToGroceryList}>
                Generate Grocery List
            </button>
        </div>
    );
};

export default ReviewMenu;