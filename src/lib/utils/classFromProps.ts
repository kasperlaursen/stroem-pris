/** Simple utility to get class from $$restProps */
export const classFromProps = (props: unknown): string => {
	const classProp = (props as { class: string })?.class;
	if (classProp && typeof classProp === 'string') {
		return classProp;
	}
	return '';
};
