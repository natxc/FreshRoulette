import React from "react";
import { render } from "@testing-library/react";
import App from "./Pages/Home/App";
import "@testing-library/jest-dom";

test("renders the app without crashing", () => {
    render(<App />);
});
