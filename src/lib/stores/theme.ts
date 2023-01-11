import { browser } from '$app/environment';
import { writable } from 'svelte/store';

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

export { theme };
