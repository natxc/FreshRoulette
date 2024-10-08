import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import your specific styles

const GroceryList = ({ recipes }) => {
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get("/ingredients");
                setIngredients(response.data);
            } catch (error) {
                console.error("Error fetching ingredients:", error);
            }
        };

        fetchIngredients();
    }, []); // Empty dependency array ensures the effect runs only once

    // Combine ingredients from all recipes
    const combinedIngredients = recipes.reduce((acc, recipe) => {
        // Fetch ingredients for the current recipe based on the Link property
        const recipeIngredients = ingredients.filter((i) => i.Link === recipe.Link);

        // Check if the 'recipeIngredients' array is not empty
        if (recipeIngredients.length > 0) {
            // Combine quantities and units for each unique ingredient
            const uniqueRecipeIngredients = Array.from(new Set(recipeIngredients.map((item) => item.Ingredient)));

            // Append each unique ingredient with its category, quantity, and unit
            return acc.concat(
                uniqueRecipeIngredients.map((ingredient) => {
                    const matchingIngredients = recipeIngredients.filter((item) => item.Ingredient === ingredient);

                    // Concatenate quantities and units for the same ingredient
                    const combinedQuantity = matchingIngredients.map((item) => item.Quantity).join(' + ');
                    const combinedUnit = matchingIngredients.map((item) => item.Unit).join(' + ');

                    return {
                        ingredient: `${combinedQuantity} ${combinedUnit} ${ingredient}`,
                        category: recipeIngredients[0].category // Use the category from the first ingredient
                    };
                })
            );
        }
        return acc;
    }, []);

    // Get unique categories
    const uniqueCategories = Array.from(new Set(combinedIngredients.map((item) => item.category)));

    return (
        <div className="grocery-list-container">
            <h1>Shopping List</h1>
            {uniqueCategories.map((category, index) => (
                <div key={index}>
                    <h2>{category}</h2>
                    <ul>
                        {combinedIngredients
                            .filter((item) => item.category === category)
                            .map((item, subIndex) => (
                                <li key={subIndex}>{item.ingredient}</li>
                            ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default GroceryList;
