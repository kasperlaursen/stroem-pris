export const buttonVariantClasses = {
	NONE: '',
	PRIMARY:
		'ring-blue-600 bg-blue-600 border-blue-600 text-dark hover:bg-blue-700 hover:border-blue-700 focus:bg-blue-700 focus:border-blue-700 active:bg-blue-800 active:border-blue-800',
	SECONDARY:
		'ring-slate-300 bg-slate-600 border-slate-600 text-dark hover:bg-slate-700 hover:border-slate-700 focus:bg-slate-700 focus:border-slate-700 active:bg-slate-800 active:border-slate-800',
	DANGER:
		'ring-red-300 bg-red-600 border-red-600 text-dark hover:bg-red-700 hover:border-red-700 focus:bg-red-700 focus:border-red-700 active:bg-red-800 active:border-red-800',
	GHOST:
		'ring-neutral-300 bg-neutral-200 border-neutral-200 text-neutral-600 hover:bg-neutral-300 hover:text-neutral-800 hover:border-neutral-300 focus:bg-neutral-300 focus:border-neutral-300 active:bg-neutral-500 active:border-neutral-500'
};

export const buttonBaseClasses =
	'disabled:bg-slate-400 disabled:border-slate-400 disabled:text-neutral-100 disabled:cursor-not-allowed cursor-pointer h-min border border-solid  inline-block px-4 py-2.5 font-medium text-xs leading-tight uppercase rounded focus:outline-none focus:ring-offset-2 focus:ring-2 transition duration-150 ease-in-out';

export type ButtonVariants = 'NONE' | 'PRIMARY' | 'SECONDARY' | 'DANGER' | 'GHOST';
