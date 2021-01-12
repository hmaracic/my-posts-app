import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders without crashing", async () => {
  const result = render(<App />);
  expect.assertions(2);
  expect(result.getByText("Loading...")).toBeInTheDocument();
  expect(await result.findByText("Search by author name:")).toBeInTheDocument();
});
