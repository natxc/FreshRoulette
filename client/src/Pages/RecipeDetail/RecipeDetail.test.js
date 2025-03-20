import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RecipeDetail from "./RecipeDetail";

jest.mock("./RecipeModal", () => ({ recipe }) => (
  <div data-testid="recipe-modal">Mocked RecipeModal {recipe?.Recipe || "No Recipe"}</div>
));

describe("RecipeDetail Component", () => {
    const mockRecipe = {
        Recipe: "Pasta Primavera",
        Total_Time: "30 mins",
        Images: "test-image.jpg",
        PDF: "test-recipe.pdf",
        Meal_Category: "Dinner",
        Cooking_Difficulty: "Medium",
        ingredients: [
            { Quantity: "1", Unit: "cup", Ingredient: "Tomatoes" },
            { Quantity: "2", Unit: "tbsp", Ingredient: "Olive Oil" }
        ]
    };
    const mockNutrition = {
        Calories: "250",
        Fat: "10g",
        "Saturated Fat": "2g",
        Cholesterol: "30mg",
        Sodium: "500mg",
        Carbohydrate: "30g",
        Protein: "10g"
    };

    test("renders recipe details correctly", () => {
        render(<RecipeDetail recipe={mockRecipe} nutrition={mockNutrition} ingredients={mockRecipe.ingredients} index={1} />);
        expect(screen.getByText("Pasta Primavera")).toBeInTheDocument();
    });

    test("flips the card on click", async () => {
        render(<RecipeDetail recipe={mockRecipe} nutrition={mockNutrition} ingredients={mockRecipe.ingredients} index={1} />);
        const card = screen.getByTestId("recipe-card");

        fireEvent.click(card);

        await waitFor(() => {
            expect(card.classList.contains("flipped")).toBe(true);
        });

        fireEvent.click(card);

        await waitFor(() => {
            expect(card.classList.contains("flipped")).toBe(false);
        });
    });

    test("opens and closes the modal when clicking View Instructions", async () => {
        render(<RecipeDetail recipe={mockRecipe} nutrition={mockNutrition} ingredients={mockRecipe.ingredients} index={1} />);
        fireEvent.click(screen.getByText("View Instructions"));
        expect(await screen.findByTestId("recipe-modal")).toBeInTheDocument();
    });

    test("opens the PDF in a new tab when clicking View PDF", () => {
        window.open = jest.fn();
        render(<RecipeDetail recipe={mockRecipe} nutrition={mockNutrition} ingredients={mockRecipe.ingredients} index={1} />);
        fireEvent.click(screen.getByText("View PDF"));
        expect(window.open).toHaveBeenCalledWith("test-recipe.pdf", "_blank", "noopener,noreferrer");
    });

    test("displays no data message when recipe is missing", () => {
        render(<RecipeDetail recipe={null} nutrition={null} ingredients={[]} index={1} />);
        expect(screen.getByText("No recipe data provided")).toBeInTheDocument();
    });
});
