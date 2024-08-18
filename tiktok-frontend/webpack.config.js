import { resolve as _resolve } from 'path';

export const entry = './pages/index.js';
export const output = {
    filename: 'bundle.js',
    path: _resolve(__dirname, 'dist'),
};
export const resolve = {
    extensions: ['.js'],
};
export const module = {
    rules: [],
};
export const devtool = 'source-map';