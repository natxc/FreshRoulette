import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-tooltip/dist/react-tooltip.css'
import RecipeDetail from "./RecipeDetail";
import GroceryList from "./GroceryList";
import "./App.css";
import { FaCheckCircle } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip'

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
    // TODO: create grocery list component and recipe detail component
    // TODO: able to click a recipe to keep it or keep shuffling any left

    // JSX rendering of the SlotMachine component
//     return (
//         <div className="container my-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//             <div className="row">
//                 <div className="offset-md-4 col-lg-4 text-center">
//                     {/* Display Recipe Details and Grocery List after fetching data */}
//                     {recipes.length > 0 && (
//                         <div>
//                             <h2>Selected Recipes Details</h2>
//                             {recipes.map((recipe, index) => (
//                                 <RecipeDetail
//                                     key={index}
//                                     recipe={recipe}
//                                     nutrition={nutrition.find((n) => n.Link === recipe.Link)}
//                                     ingredients={ingredients.filter((i) => i.Link === recipe.Link)}
//                                     instructions={instructions.filter((instr) => instr.Link === recipe.Link)}
//                                 />
//                             ))}
//                             {/* <GroceryList recipes={recipes} /> */}
//                         </div>
//                     )}

//                     <ul className="list-inline text-center d-flex justify-content-center align-items-center">
//                         {selectedRecipes.map((recipe, index) => (
//                             <li key={index} className="list-inline-item">
//                                 {/* Display Recipe Details */}
//                                 <RecipeDetail recipe={recipe} />
//                                 <h4>{getDayOfWeek(index)}</h4>
//                             </li>
//                         ))}
//                     </ul>
//                     <button className="btn btn-block btn-success" onClick={startSlotMachine} disabled={isButtonDisabled}>
//                         Shuffle
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

//     return (
//         <div className="container my-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//             <div className="row">
//                 <div className="offset-md-4 col-lg-4 text-center">
//                     <ul className="list-inline text-center d-flex justify-content-center align-items-center">
//                         {selectedRecipes.map((recipe, index) => (
//                             <li key={index} className="list-inline-item">
//                                 <h4>{getDayOfWeek(index)}</h4>
//                                 <img src={recipe.Images} alt={recipe.Recipe} className="rounded" style={{ width: "200px" }} />
//                                 {/* Display Nutrition Information */}
//                                 {/* {nutrition.map((nutrient) => {
//                                     if (nutrient.Link === recipe.Link) {
//                                         return (
//                                          <p>Calories: {nutrient.Calories}</p>
//                                         );
//                                     }
//                                     return null; // If no matching nutrition data is found
//                                 })} */}
//                             </li>
//                         ))}
//                     </ul>
//                     <button className="btn btn-block btn-success" onClick={startSlotMachine} disabled={isButtonDisabled}>Shuffle</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

    return (
        <div className="container my-5">
            <ReactTooltip effect="solid" place="bottom" />
            <div className="row">
                <div className="offset-md-4 col-lg-4 text-center">
                    <ul className="list-inline text-center d-flex justify-content-center align-items-center">
                        {selectedRecipes.map((recipe, index) => (
                            <li key={index} className="list-inline-item">
                                <h4>{getDayOfWeek(index)}</h4>
                                {recipe.placeholder ? (
                                    <div className="d-flex mb-3">
                                        <div className="grey-box">
                                            <span>?</span>
                                        </div>
                                    </div>
                                ) : (
                                    // TODO: fix this class and make the images and grey boxes responsive
                                    <div
                                        className={`recipe-image ${acceptedRecipes.includes(recipe) ? 'accepted' : ''}`}
                                        onClick={() => toggleAcceptance(recipe)}
                                    >
                                        <img
                                            src={recipe.Images}
                                            alt={recipe.Recipe}
                                            className="rounded"
                                            style={{ width: '200px' }}
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content={recipe.Recipe}
                                        />
                                        <ReactTooltip id="my-tooltip" place="bottom" />
                                        {acceptedRecipes.includes(recipe) && (
                                            <FaCheckCircle className="check-icon" />
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="mb-2">
                        {acceptedRecipes.length < 7 && (
                            <button
                                className="btn btn-block btn-success"
                                onClick={startSlotMachine}
                                disabled={isButtonDisabled}
                            >
                                Shuffle
                            </button>
                        )}
                    </div>
                    {acceptedRecipes.length === 7 && (
                        <div className="mb-2">
                            <button
                                className="btn btn-block btn-primary"
                                onClick={showDetailsHandler}
                                style={{ marginRight: '10px' }}
                            >
                                Show Details
                            </button>
                                <button
                                    className="btn btn-block btn-secondary"
                                    onClick={showListHandler}
                                >
                                    Show List
                                </button>
                        </div>
                    )}
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
            {/* {showList && (
                <div className="grocery-list-wrapper">
                    <GroceryList recipes={acceptedRecipes} />
    </div>
)
} */}
{
    showList && (
        <div className="grocery-list-wrapper">
            {/* Render your GroceryList component here */}
            <GroceryList recipes={acceptedRecipes} />
        </div>
    )
}
        </div >
    );
};

export default SlotMachine;