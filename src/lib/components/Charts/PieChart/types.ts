export interface PieChartData {
	/**
	 * The value of the data entry.
	 * This determines how large the slice for this entry will be.
	 */
	value: number;
	/**
	 * The label associated with the entry.
	 * This will be show in the chart to descripte the entry.
	 */
	label: string;
	/**
	 * A valid tailwind fill class to apply to the chart slice.
	 */
	color: `fill-${string}`;
}

export interface PiceSliceProps {
	chartSize: number;
	decimalValue: number;
	startAngle: number;
	class: string;
	title: string;
}
