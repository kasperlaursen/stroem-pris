/** 
 * Simple utility to get class from $$restProps 
 * Returns the value of the class property of an object passed as props.
 * If the class property is not present or not a string, an empty string is returned.
 * @param {unknown} props - An object that may contain a class property.
 * @returns {string} The value of the class property, or an empty string if not present or not a string.
 * @throws {Error} If props is not an object.
*/
export const classFromProps = (props: unknown): string => {
	if (!props || typeof props !== 'object') {
		throw new Error('Props must be an object');
	}
	return classFromObject(props);
};

const classFromObject = (props: unknown): string => {
	const classProp = (props as { class: string })?.class;
	if (classProp && typeof classProp === 'string') {
		return classProp;
	}

	return '';
};
