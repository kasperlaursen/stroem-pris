import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

const defaultValue = 'light';
const isDarkMode = () =>
	localStorage.theme === 'dark' ||
	(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

const initialValue = browser ? (isDarkMode() ? 'dark' : 'light' ?? defaultValue) : defaultValue;

const theme = writable<'light' | 'dark'>(initialValue);

theme.subscribe((value) => {
	if (browser) {
		localStorage.theme = value;
		if (isDarkMode()) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
});

// Get the value out of storage on load.
const localFixed = isBrowser ? localStorage.localFixed : 0;
const fixed = writable(localFixed || 0);
fixed.subscribe((value) => {
	if (isBrowser) {
		localStorage.localFixed = value;
	}
});

export { theme, fixed };
