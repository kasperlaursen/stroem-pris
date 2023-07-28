import { render, screen } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import { spotDataToSpotChartEntries } from "$lib/utils/spotDataToSpotChartEntries";
import SpotChart from "$lib/components/Charts/SpotChart/SpotChart.svelte";
import SpotChartWrapper from "./SpotChartWrapper.svelte"; // Replace this with the actual name of your component

// Mocking the necessary imports
vi.mock("$lib/utils/spotDataToSpotChartEntries");
vi.mock("$lib/components/Charts/SpotChart/SpotChart.svelte");

describe("SpotChartWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  });

  it("Does not render SpotChart if spotData and feesData are not defined", () => {
    render(SpotChartWrapper);
    expect(screen.queryByRole('SpotChart')).toBeNull();
  });

});
