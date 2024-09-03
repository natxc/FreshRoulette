import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-tooltip/dist/react-tooltip.css'
import RecipeDetail from "./RecipeDetail";
import GroceryList from "./GroceryList";
import "./App.css";
import "./GroceryList.css"
import "./SlotMachine.css"
import { FaCheckCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip'

// SlotMachine component
const SlotMachine = () => {
    const [recipes, setRecipes] = useState([]);
    const [nutrition, setNutrition] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [selectedRecipes, setSelectedRecipes] = useState([
        { placeholder: true },
        { placeholder: true },
        { placeholder: true },
        { placeholder: true },
        { placeholder: true },
        { placeholder: true },
        { placeholder: true },
    ]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showList, setShowList] = useState(false);
    const [acceptedRecipes, setAcceptedRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get("/recipes");
                setRecipes(response.data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        const fetchNutrition = async () => {
            try {
                const response = await axios.get("/nutrition");
                setNutrition(response.data);
            } catch (error) {
                console.error("Error fetching nutrition:", error);
            }
        };

        const fetchIngredients = async () => {
            try {
                const response = await axios.get("/ingredients");
                setIngredients(response.data);
            } catch (error) {
                console.error("Error fetching ingredients:", error);
            }
        };

        const fetchInstructions = async () => {
            try {
                const response = await axios.get("/instructions");
                setInstructions(response.data);
            } catch (error) {
                console.error("Error fetching instructions:", error);
            }
        };

        fetchRecipes();
        fetchNutrition();
        fetchIngredients();
        fetchInstructions();
    }, []);

    // Function to get the day of the week based on the index
    const getDayOfWeek = (index) => {
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return daysOfWeek[index % daysOfWeek.length];
    };

    // const getRandomNumber = (min, max) => {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // };

    const startSlotMachine = () => {
        setIsButtonDisabled(true);

        // Set a timeout to simulate the slot machine spinning effect
        setTimeout(() => {
            const unacceptedRecipes = recipes.filter((recipe) => !acceptedRecipes.includes(recipe));
            const newRecipes = selectedRecipes.map((recipe, index) => {
                if (acceptedRecipes.includes(recipe)) {
                    return recipe; // Keep accepted recipes at their positions
                } else {
                    return unacceptedRecipes[Math.floor(Math.random() * unacceptedRecipes.length)];
                }
            });

            setSelectedRecipes(newRecipes);
            setShowDetails(false);
            setIsButtonDisabled(false);
        }, 1000);
    };

    const showDetailsHandler = () => {
        setShowDetails(true);
    };

    const showListHandler = () => {
        setShowList(true);
    };

    const toggleAcceptance = (recipe) => {
        if (acceptedRecipes.includes(recipe)) {
            setAcceptedRecipes((prevAccepted) =>
                prevAccepted.filter((accepted) => accepted !== recipe)
            );
        } else {
            setAcceptedRecipes((prevAccepted) => [...prevAccepted, recipe]);
        }
    };

    // TODO: after shuffle button is hit, an accept button pops up
    // accept prints out recipes details and a grocery list

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-12">
                    <div className="recipe-container">
                        {selectedRecipes.map((recipe, index) => (
                            <div key={index} className="recipe-item">
                                <div className="day-of-week">
                                    <h4>{getDayOfWeek(index)}</h4>
                                </div>
                                {recipe.placeholder ? (
                                    <div className="grey-box">
                                        <span>?</span>
                                    </div>
                                ) : (
                                    <div
                                        className={`recipe-image ${acceptedRecipes.includes(recipe) ? 'accepted' : ''}`}
                                        onClick={() => toggleAcceptance(recipe)}
                                        data-tooltip-id="recipe-tooltip"
                                        data-tooltip-content={recipe.Recipe}
                                    >
                                        <img
                                            src={recipe.Images}
                                            alt={recipe.Recipe}
                                        />
                                        {acceptedRecipes.includes(recipe) && (
                                            <FaCheckCircle className="check-icon" />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <Tooltip id="recipe-tooltip" place="bottom" />
                    <div className="text-center">
                        {acceptedRecipes.length < 7 && (
                            <button
                                className="btn btn-block btn-success mb-2"
                                onClick={startSlotMachine}
                                disabled={isButtonDisabled}
                            >
                                Shuffle
                            </button>
                        )}
                        {acceptedRecipes.length === 7 && (
                            <div>
                                <button
                                    className="btn btn-block btn-primary mb-2 mr-2"
                                    onClick={showDetailsHandler}
                                >
                                    Show Details
                                </button>
                                <> </>
                                <button
                                    className="btn btn-block btn-secondary mb-2"
                                    onClick={showListHandler}
                                >
                                    Show List
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showDetails && (
                <div className="recipe-cards-wrapper">
                        <br />
                    <h2 style={{ textAlign: 'center' }}>Recipe Details</h2>
                        {acceptedRecipes.map((recipe, index) => (
                            <RecipeDetail
                                key={index}
                                recipe={recipe}
                                nutrition={nutrition.find((n) => n.Link === recipe.Link)}
                                ingredients={ingredients.filter((i) => i.Link === recipe.Link)}
                                instructions={instructions.filter((instr) => instr.Link === recipe.Link)}
                                PDF={recipe.PDF}
                            />
                        ))}
                    </div>
            )}
{
    showList && (
        <div className="grocery-list-wrapper">
            <GroceryList recipes={acceptedRecipes} />
        </div>
    )
}
        </div >
    );
};

export default SlotMachine;