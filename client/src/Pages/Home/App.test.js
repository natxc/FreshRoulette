import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../Home/App";
import "@testing-library/jest-dom";

test("renders App component", () => {
  render(<App />);
  expect(screen.getByText(/What's on the menu\?/i)).toBeInTheDocument();
});
