import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const GroceryList = () => {
    const [lockedRecipes, setLockedRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        const storedRecipes = localStorage.getItem("groceryListData");
        if (storedRecipes) {
            setLockedRecipes(JSON.parse(storedRecipes));
        }
    }, []);

    useEffect(() => {
        if (!lockedRecipes || lockedRecipes.length === 0) {
            console.warn("⚠️ No locked recipes available, skipping ingredient fetch.");
            return;
        }

        const fetchIngredients = async () => {
            try {
                const recipeUUIDs = lockedRecipes.map(recipe => recipe.uuid).join(",");
                const response = await axios.get(`/ingredients?uuids=${recipeUUIDs}`);

                setIngredients(response.data);
            } catch (error) {
                console.error("Error fetching ingredients:", error);
            }
        };

        fetchIngredients();
    }, [lockedRecipes]);

    const unitlessIngredients = new Set();

    const groupedIngredients = ingredients.reduce((acc, item) => {
        if (!item.Ingredient) return acc;

        const ingredientKey = item.Ingredient.trim().toLowerCase();
        const unit = item.Unit ? item.Unit.trim().toLowerCase() : "no unit";
        const quantity = item.Quantity ? parseFloat(item.Quantity) || 0 : null;

        if (unit === "no unit" && quantity === null) {
            unitlessIngredients.add(ingredientKey);
        } else {
            if (!acc[ingredientKey]) {
                acc[ingredientKey] = {};
            }
            if (acc[ingredientKey][unit]) {
                acc[ingredientKey][unit] += quantity;
            } else {
                acc[ingredientKey][unit] = quantity;
            }
        }

        return acc;
    }, {});

    const sortedIngredients = Object.entries(groupedIngredients)
        .map(([ingredient, units]) => {
            const formattedQuantities = Object.entries(units)
                .map(([unit, quantity]) => `${Math.round(quantity * 100) / 100} ${unit === "no unit" ? "" : unit}`)
                .join(" + ");

            const formattedIngredient = ingredient
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return { ingredient: formattedIngredient, quantity: formattedQuantities };
        })
        .sort((a, b) => a.ingredient.localeCompare(b.ingredient));

    unitlessIngredients.forEach((ingredient) => {
        const formattedIngredient = ingredient
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        sortedIngredients.push({ ingredient: formattedIngredient, quantity: "" });
    });

    const categorizedIngredients = sortedIngredients.reduce((acc, item) => {
        const category = ingredients.find(i => i.Ingredient.trim().toLowerCase() === item.ingredient.toLowerCase())?.category || "Other";

        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    const sortedCategories = Object.keys(categorizedIngredients).sort();

    return (
        <div className="grocery-list-container">
            <br></br>
            <h1>Shopping List for all Recipes</h1>
            {lockedRecipes.length === 0 ? (
                <p>No recipes selected. Go back and choose your meals!</p>
            ) : (
                sortedCategories.map((category, index) => (
                    <div key={index}>
                        <h2>{category}</h2>
                        <ul>
                            {categorizedIngredients[category].map((item, subIndex) => (
                                <li key={subIndex}>
                                    {item.quantity} {item.ingredient}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default GroceryList;
