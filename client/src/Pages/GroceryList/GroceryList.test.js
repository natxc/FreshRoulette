// import React from "react";
// import { render, screen, waitFor } from "@testing-library/react";
// import GroceryList from "./GroceryList";
// import axios from "axios";

// jest.mock("axios");

// beforeEach(() => {
//   localStorage.clear();
//   jest.clearAllMocks();
// });

// test("renders grocery list with categorized ingredients", async () => {
//   const mockedRecipes = [
//     { uuid: "abc123", Recipe: "Test Recipe" },
//     { uuid: "def456", Recipe: "Another Recipe" },
//   ];

//   const mockedIngredients = [
//     { Ingredient: "Tomatoes", Quantity: "2", Unit: "cup", category: "Produce" },
//     { Ingredient: "Olive Oil", Quantity: "3", Unit: "tbsp", category: "Pantry" },
//   ];

//   localStorage.setItem("groceryListData", JSON.stringify(mockedRecipes));
//   axios.get.mockResolvedValueOnce({ data: mockedIngredients });

//   render(<GroceryList />);

//   await waitFor(() => {
//     expect(screen.getByText("Shopping List for all Recipes")).toBeInTheDocument();
//   });

//   expect(screen.getByText("Produce")).toBeInTheDocument();
//   expect(screen.getByText("Pantry")).toBeInTheDocument();
//   expect(screen.getByText(/2 cup Tomatoes/i)).toBeInTheDocument();
//   expect(screen.getByText(/3 tbsp Olive Oil/i)).toBeInTheDocument();
// });

// test("shows fallback message when no recipes are in localStorage", () => {
//   render(<GroceryList />);
//   expect(screen.getByText("No recipes selected. Go back and choose your meals!")).toBeInTheDocument();
// });
