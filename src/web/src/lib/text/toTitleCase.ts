export const toTitleCase = (text: string): string => {
	return text
		.split(" ")
		.map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
		.join(" ");
};
