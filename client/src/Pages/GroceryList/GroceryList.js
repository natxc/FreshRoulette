import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./style.css";

const GroceryList = () => {
    const location = useLocation();
    const recipes = useMemo(() => location.state?.recipes || [], [location.state]);

    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        if (recipes.length === 0) {
            return;
        }

        const fetchIngredients = async () => {
            try {
                const ingredientPromises = recipes.map((recipe) => {
                    if (!recipe.uuid) {
                        return Promise.resolve({ data: [] });
                    }
                    return axios.get(`/ingredients?uuid=${recipe.uuid}`);
                });

                const responses = await Promise.all(ingredientPromises);
                const allIngredients = responses.flatMap((response) => response.data || []);

                setIngredients(allIngredients);
            } catch (error) {
            }
        };

        fetchIngredients();
    }, [recipes]);

    const combinedIngredients = ingredients.reduce((acc, item) => {
        if (!item.Ingredient) return acc;

        const quantity = parseFloat(item.Quantity) || 0;

        if (quantity === 0) return acc;

        const existingIngredient = acc.find(
            (ing) => ing.ingredient === item.Ingredient && ing.unit === item.Unit
        );

        if (existingIngredient) {
            existingIngredient.quantity = Math.round(existingIngredient.quantity + quantity);
        } else {
            acc.push({
                ingredient: item.Ingredient,
                quantity: Math.round(quantity),
                unit: item.Unit || "",
                category: item.category || "Other",
            });
        }
        return acc;
    }, []);

    const uniqueCategories = [...new Set(combinedIngredients.map((item) => item.category))];

    return (
        <div className="grocery-list-container">
            <h1>Shopping List</h1>
            {recipes.length === 0 ? (
                <p>No recipes selected. Go back and choose your meals!</p>
            ) : (
                uniqueCategories.map((category, index) => (
                    <div key={index}>
                        <h2>{category}</h2>
                        <ul>
                            {combinedIngredients
                                .filter((item) => item.category === category)
                                .map((item, subIndex) => (
                                    <li key={subIndex}>
                                        {item.quantity} {item.unit} {item.ingredient}
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
