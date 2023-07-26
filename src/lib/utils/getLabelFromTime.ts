import { DateTime } from "luxon";

interface GetLabelFromTimeProps {
  hour?: DateTime;
  append?: string;
}

/**
 * This is a utility function used to generate a relative time label based on a given Datetime.
 * If the provided `hour` does not match the current day or hour, it formats the given `hour`
 * and returns it in relative calendar format.
 *
 * @param {GetLabelFromTimeProps} props - The properties for the function.
 * @param {DateTime} props.hour - The DateTime instance from Luxon to generate the label from. If not provided, it defaults to the current time.
 * @param {string} [props.append] - An optional string to append to the time label.
 *
 * @returns {string} - A string representing the relative time label based on the provided `hour` and `append`.
 *
 * @example
 *
 *  import { DateTime } from "luxon";
 *
 *  const hour = DateTime.now();
 *  const append = "Pris";
 *
 *  getLabelFromTime({ hour, append });
 *
 *  -> If it's the current hour it would return: "Nuværende Pris"
 *  -> If it's not the current hour it would return a string like: "Pris kl 16 om 3 dage"
 *
 * @throws {Error} - Throws an error if the `hour` property is not a valid DateTime instance.
 */
export const getLabelFromTime = ({ hour, append }: GetLabelFromTimeProps) => {
  const currentTime = DateTime.now();
  const currentLabel = `Nuværende ${append}`;

  if (!hour) {
    return currentLabel;
  }

  if (currentTime.day !== hour.day || currentTime.hour !== hour.hour) {
    return `${append} ${hour.toFormat("kl H")} ${hour
      .plus({ days: currentTime.diff(hour).days })
      .toRelativeCalendar({ locale: "da" })}`;
  }

  return currentLabel;
};
