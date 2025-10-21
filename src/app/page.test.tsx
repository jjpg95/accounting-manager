import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Home page", () => {
  it("should render home page correctly", () => {
    render(<Page />);

    expect(
      screen.getByRole("button", { name: /Añadir registro/i })
    ).toBeInTheDocument();
  });
});
