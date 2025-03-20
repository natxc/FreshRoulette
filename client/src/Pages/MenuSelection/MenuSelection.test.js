// import React from "react";
// import { render, screen, waitFor } from "@testing-library/react";
// import { MemoryRouter, Route, Routes } from "react-router-dom";
// import "@testing-library/jest-dom";
// import ReviewMenu from "./ReviewMenu";
// const axios = require("axios");


// jest.mock("axios");

// jest.mock("../RecipeDetail/RecipeDetail", () => ({ recipe }) => (
//   <div data-testid="recipe-detail">{recipe?.Recipe}</div>
// ));

// const mockLockedMeals = [
//   { uuid: "1", Recipe: "Meal 1", nutrition: {}, ingredients: [], instructions: [] },
//   { uuid: "2", Recipe: "Meal 2", nutrition: {}, ingredients: [], instructions: [] },
// ];

// describe("ReviewMenu Component", () => {
//   test("renders locked meals and grocery list button", async () => {
//     axios.get.mockImplementation((url) => {
//       const uuid = url.split("/").pop();
//       const meal = mockLockedMeals.find((m) => m.uuid === uuid);
//       return Promise.resolve({ data: meal });
//     });

//     render(
//       <MemoryRouter initialEntries={[{ pathname: "/review-menu", state: { lockedMeals: ["1", "2"] } }]}>
//         <Routes>
//           <Route path="/review-menu" element={<ReviewMenu />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId("recipe-detail")).toBeInTheDocument();
//     });

//     expect(screen.getByText("This week's menu")).toBeInTheDocument();
//     expect(screen.getByText("View Grocery List")).toBeInTheDocument();
//     expect(screen.getByText("Meal 1")).toBeInTheDocument();
//     expect(screen.getByText("Meal 2")).toBeInTheDocument();
//   });
// });
