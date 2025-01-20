import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SlotMachine from "../SlotMachine/SlotMachine";
import "@testing-library/jest-dom";
// import axios from "axios";

// Mock axios GET requests
jest.mock("axios", () => ({
    get: jest.fn((url) => {
        if (url === "/recipes") {
            return Promise.resolve({ data: [{ Recipe: "Pizza", Images: "pizza.jpg" }] });
        }
        if (url === "/nutrition") {
            return Promise.resolve({ data: [] });
        }
        if (url === "/ingredients") {
            return Promise.resolve({ data: [] });
        }
        if (url === "/instructions") {
            return Promise.resolve({ data: [] });
        }
    }),
}));

// Mock RecipeDetail to avoid rendering unnecessary components
jest.mock("../RecipeDetail/RecipeDetail", () => () => <div data-testid="recipe-detail">RecipeDetail</div>);

describe("SlotMachine Component", () => {
    test("renders the shuffle button", async () => {
        render(<SlotMachine />);
        await waitFor(() => expect(screen.getByText("Shuffle")).toBeInTheDocument());
    });

    // test("disables shuffle button while processing", async () => {
    //     render(<SlotMachine />);
    //     const shuffleButton = screen.getByText("Shuffle");

    //     fireEvent.click(shuffleButton);
    //     expect(shuffleButton).toBeDisabled();

    //     await waitFor(() => expect(shuffleButton).not.toBeDisabled());
    // });

    // test("toggles recipe acceptance", async () => {
    //     render(<SlotMachine />);
    //     await waitFor(() => expect(screen.getByAltText("Pizza")).toBeInTheDocument());

    //     const recipeImage = screen.getByAltText("Pizza");
    //     fireEvent.click(recipeImage);
    //     expect(recipeImage.parentElement).toHaveClass("accepted");

    //     fireEvent.click(recipeImage);
    //     expect(recipeImage.parentElement).not.toHaveClass("accepted");
    // });
});
