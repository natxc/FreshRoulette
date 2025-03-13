import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const MenuSelection = () => {
    const [allRecipes, setAllRecipes] = useState([]);
    const [shuffledMeals, setShuffledMeals] = useState([]);
    const [lockedMeals, setLockedMeals] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); 

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://freshroulette.app";
                const response = await axios.get(`${API_BASE_URL}/recipes`);


                if (!response.data || response.data.length === 0) {
                    console.warn("No recipes received from API");
                    return;
                }

                setAllRecipes(response.data);

                const shuffleArray = (array) => {
                    return array.sort(() => Math.random() - 0.5);
                };

                const shuffledRecipes = shuffleArray([...response.data]);
                setShuffledMeals(shuffledRecipes.slice(0, 7));
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

        setIsButtonDisabled(true);

        setTimeout(() => {
            const unlockedMeals = allRecipes.filter((meal) => !lockedMeals.includes(meal.uuid));

            const shuffled = [...unlockedMeals].sort(() => Math.random() - 0.5);

            const newMealList = shuffledMeals.map((meal) =>
                lockedMeals.includes(meal.uuid) ? meal : shuffled.pop()
            );

            setShuffledMeals(newMealList);
            setIsButtonDisabled(false);
        }, 1000);
    };

    return (
        <div className="menu-container">
            <header className="navbar">
                <Link to="/" className="logo-container">
                    <img src="/FreshRoulette.svg" alt="Fresh Roulette Logo" className="logo" />
                </Link>
            </header>

            <h2 className="menu-title">This week's menu</h2>
            <p className="menu-description">
                Lock the meals you want to keep and reshuffle the rest. Once all of your days are locked in, we'll generate your shopping list.
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

                {shuffledMeals.length === 7 && (
                    <div className="bon-appetit">Bon Appétit</div>
                )}

            </div>

            <div className="menu-actions">
                <button
                    className="shuffle-button"
                    onClick={shuffleMeals}
                    disabled={isButtonDisabled || lockedMeals.length === shuffledMeals.length}
                >
                    Shuffle
                </button>
                <Link to="/review-menu" state={{ lockedMeals }}>
                    <button className="continue-button" disabled={lockedMeals.length < shuffledMeals.length}>
                        Continue
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default MenuSelection;