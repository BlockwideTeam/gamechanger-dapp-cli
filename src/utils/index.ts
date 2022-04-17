import path from 'path';

export const resolveGlobal = (file) => {
	return path.resolve(__dirname, file);
};
