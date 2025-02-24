import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const MenuSelection = () => {
    const [allRecipes, setAllRecipes] = useState([]); // Store all recipes from API
    const [shuffledMeals, setShuffledMeals] = useState([]); // The currently displayed 7 meals
    const [lockedMeals, setLockedMeals] = useState([]); // List of locked meal UUIDs
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Prevent double-clicking shuffle

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get("http://localhost:9001/recipes");
                console.log("API Response:", response.data); // Debugging API response

                if (!response.data || response.data.length === 0) {
                    console.warn("No recipes received from API");
                    return;
                }

                setAllRecipes(response.data); // Store all available recipes
                setShuffledMeals(response.data.slice(0, 7)); // Start with the first 7 recipes
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        fetchRecipes();
    }, []);

    const getDayOfWeek = (index) => {
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return daysOfWeek[index % daysOfWeek.length];
    };

    const toggleLock = (id) => {
        setLockedMeals((prev) =>
            prev.includes(id) ? prev.filter((mealId) => mealId !== id) : [...prev, id]
        );
    };

    const shuffleMeals = () => {
        if (isButtonDisabled) return;

        setIsButtonDisabled(true); // Disable shuffle button temporarily

        setTimeout(() => {
            // Get all available recipes (excluding locked ones)
            const unlockedMeals = allRecipes.filter((meal) => !lockedMeals.includes(meal.uuid));

            // Shuffle only the unlocked meals
            const shuffled = [...unlockedMeals].sort(() => Math.random() - 0.5);

            // Update selected meals: Keep locked meals, replace others with shuffled ones
            const newMealList = shuffledMeals.map((meal) =>
                lockedMeals.includes(meal.uuid) ? meal : shuffled.pop()
            );

            setShuffledMeals(newMealList);
            setIsButtonDisabled(false); // Re-enable shuffle button
        }, 1000);
    };

    return (
        <div className="menu-container">
            <header className="navbar">
                <Link to="/" className="logo-container">
                    <img src="/FreshRoulette.svg" alt="Fresh Roulette Logo" className="logo" />
                </Link>
            </header>

            <h2 className="menu-title">This week’s menu</h2>
            <p className="menu-description">
                Lock the meals you want to keep and reshuffle the rest. Once all of your days are locked in, we’ll generate your shopping list.
            </p>

            <div className="meal-grid">
                {shuffledMeals.map((meal, index) => (
                    <div key={meal.uuid} className="meal-card">
                        <div className="meal-image">
                            {meal.Images ? (
                                <img
                                    src={meal.Images}
                                    alt={meal.Recipe || "Meal"}
                                    onError={(e) => {
                                        console.error("Image failed to load:", meal.Images);
                                        e.target.style.display = "none"; // Hide broken image
                                        e.target.parentNode.classList.add("grey-box"); // Add grey box
                                    }}
                                />
                            ) : (
                                <div className="grey-box">
                                    <span>?</span>
                                </div>
                            )}

                            {/* Lock/Unlock Button with Image */}
                            <button className="lock-button" onClick={() => toggleLock(meal.uuid)}>
                                <img
                                    src={lockedMeals.includes(meal.uuid) ? "/Locked=On.png" : "/Locked=Off.png"}
                                    alt={lockedMeals.includes(meal.uuid) ? "Locked" : "Unlocked"}
                                />
                            </button>
                        </div>
                        <p className="meal-day">{getDayOfWeek(index)}</p>
                        <p className="meal-name">{meal.Recipe || "No Title"}</p>
                    </div>
                ))}
            </div>

            <div className="menu-actions">
                <button
                    className="shuffle-button"
                    onClick={shuffleMeals}
                    disabled={isButtonDisabled || lockedMeals.length === shuffledMeals.length}
                >
                    Shuffle
                </button>
                <button className="continue-button" disabled={lockedMeals.length < shuffledMeals.length}>
                    Continue
                </button>
            </div>
        </div>
    );
};

export default MenuSelection;
