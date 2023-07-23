import type { DateTime } from "luxon/src/datetime";
import { writable } from "svelte/store";

/** UserSettings interface representing user's preferences. */
export interface SelectedHour {
  /** The selected hour. */
  selectedHour?: DateTime;
}

// Default user settings.
const defaultSelectedHour: SelectedHour = {
  selectedHour: undefined,
};

export const selectedHour = writable<SelectedHour>(defaultSelectedHour);
