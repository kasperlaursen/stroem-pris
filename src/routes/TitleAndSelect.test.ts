import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import TitleAndSelect from "./TitleAndSelect.svelte";
4;
describe("TitleAndSelect", () => {
  it("Renders the title ", () => {
    render(TitleAndSelect, { props: { area: "DK1" } });
    expect(screen.getByText("Variabel Strømpris")).toBeInTheDocument();
  });

  it("Sets the correct priceArea defualt (DK1)", () => {
    render(TitleAndSelect, { props: { area: "DK1" } });
    expect(screen.getByTestId("price-area-select")).toBeInTheDocument();
    expect(screen.getByTestId("price-area-select")).toHaveValue("DK1");
  });

  it("Sets the correct priceArea defualt (DK2)", () => {
    render(TitleAndSelect, { props: { area: "DK2" } });
    expect(screen.getByTestId("price-area-select")).toBeInTheDocument();
    expect(screen.getByTestId("price-area-select")).toHaveValue("DK2");
  });
});
