// import React from "react";
// import { render, screen } from "@testing-library/react";
// import About from "../About/About";
// import "@testing-library/jest-dom";

// jest.mock("../../Common/ErrorBoundary", () => ({ children }) => <>{children}</>);
// jest.mock("../../Common/Header", () => () => <div data-testid="header">Header</div>);
// jest.mock("../../Common/ScrollToTopButton", () => () => <div data-testid="scroll-button">ScrollToTopButton</div>);

// describe("About Component", () => {
//     test("renders header", () => {
//         render(<About />);
//         expect(screen.getByTestId("header")).toBeInTheDocument();
//     });

//     test("renders main heading", () => {
//         render(<About />);
//         expect(screen.getByRole("heading", { name: /what's the deal here\?/i })).toBeInTheDocument();
//     });

//     test("renders main content", () => {
//         render(<About />);
//         expect(screen.getByText(/The idea for this project came about many years ago/i)).toBeInTheDocument();
//     });

//     test("renders Kroger logo", () => {
//         render(<About />);
//         const image = screen.getByAltText("Kroger Logo");
//         expect(image).toBeInTheDocument();
//         expect(image).toHaveAttribute("src", "https://developer.kroger.com/assets/logos/integrated-blue-text.svg");
//     });
// });
