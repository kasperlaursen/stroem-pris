import type { DateTime } from 'luxon';
import type { Colors, RowState } from './types';

interface GetColorParams {
	average: number;
	current: number;
	multiplyer?: number;
}

export const getColor = ({ current, average, multiplyer = 0.1 }: GetColorParams): Colors => {
	const max = average * (1 + multiplyer);
	const min = average * (1 - multiplyer);

	if (current > max) return 'red';
	if (current < min) return 'green';
	return 'yellow';
};

interface GetWidthParams {
	current: number;
	max: number;
}

export const getWidth = ({ current, max }: GetWidthParams): number => current / max;

interface GetStateParams {
	time: DateTime;
	now: DateTime;
}

export const getState = ({ time, now }: GetStateParams): RowState => {
	const isNow = time.day === now.day && time.hour === now.hour;
	const isPast = time.day === now.day && time.hour < now.hour;

	if (isNow) return 'active';
	if (isPast) return 'inactive';
	return 'none';
};
