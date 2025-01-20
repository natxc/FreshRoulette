import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeDetail from "../RecipeDetail/RecipeDetail";
import "@testing-library/jest-dom";

describe("RecipeDetail Component", () => {
    test("renders 'No recipe data provided' when recipe is missing", () => {
        render(<RecipeDetail />);
        expect(screen.getByText("No recipe data provided")).toBeInTheDocument();
    });

    test("renders recipe details correctly", () => {
        const mockRecipe = {
            Recipe: "Pasta",
            Total_Time: "30",
            Images: "pasta.jpg",
            Meal_Category: "Dinner",
            Cooking_Difficulty: "Easy",
            PDF: "recipe.pdf",
        };

        render(<RecipeDetail recipe={mockRecipe} ingredients={[]} instructions={[]} />);

        expect(screen.getByText("Pasta")).toBeInTheDocument();
        expect(screen.getByText("Dinner")).toBeInTheDocument();
        expect(screen.getByText("30 min")).toBeInTheDocument();
    });

    // test("toggles flipped state on click", () => {
    //     const mockRecipe = { Recipe: "Pasta", Images: "pasta.jpg" };
    //     render(<RecipeDetail recipe={mockRecipe} ingredients={[]} instructions={[]} />);

    //     const card = screen.getByRole("article", { hidden: true }); // Ensure it's found
    //     fireEvent.click(card);
    //     expect(card).toHaveClass("flipped");
    // });
});
