import { DateTime, Interval } from "luxon";

/**
 * Interface representing a data object containing an hourUTC property.
 * @typedef {Object} DataWithHourUTC
 * @property {Date} hourUTC - A date object representing the hour in UTC.
 */
interface DataWithHourUTC {
  /** A date object representing the hour in UTC. */
  hourUTC: Date;
}
/**
 * Interface representing the parameters for the filterDataToInterval function.
 * @typedef {Object} filterDataToIntervalParams
 * @template DataType - A data type extending DataWithHourUTC.
 * @property {DateTime} from - The start date and time for filtering data.
 * @property {DateTime} to - The end date and time for filtering data.
 * @property {DataType[]} data - An array of data objects to be filtered.
 */
interface filterDataToIntervalParams<DataType extends DataWithHourUTC> {
  /** The start date and time for filtering data. */
  from: DateTime;
  /** The end date and time for filtering data. */
  to: DateTime;
  /** An array of data objects to be filtered */
  data: DataType[];
}

/**
 * Filters a list of Data to only contain data within the from and to date.
 * @template DataType - A data type extending DataWithHourUTC.
 * @param {filterDataToIntervalParams<DataType>} params - An object containing the parameters for filtering the data.
 * @returns {DataType[]} - An array of filtered data objects.
 */
export const filterDataToInterval = <DataType extends DataWithHourUTC>({
  from,
  to,
  data,
}: filterDataToIntervalParams<DataType>) => {
  const requestedInterval = Interval.fromDateTimes(from, to);
  const requestedDatapoints = data.filter(({ hourUTC }) =>
    requestedInterval.contains(DateTime.fromJSDate(hourUTC)),
  );
  return requestedDatapoints;
};
