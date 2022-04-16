import 'node-self';
import QRCode from 'easyqrcodejs-nodejs';
import convert from 'data-uri-to-buffer';
import Style, { size } from '../config/styles';
import Canvas from 'canvas';
import { resolve } from 'path';
import Root from 'app-root-path';

const { registerFont } = Canvas;
const fontURL = resolve(Root.toString(), './src/assets/fonts/ABSTRACT.ttf');
export const getBackground = async (width: number = size) => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (ctx) {
		const container = document.getElementById('gamearea') || document.body;

		container.appendChild(canvas);
		canvas.width = width;
		canvas.height = width;

		const sp = {
				x: 0,
				y: 0,
			},
			ep = {
				x: canvas.width,
				y: 0,
			};

		const gradient = ctx.createLinearGradient(sp.x, sp.y, ep.x, ep.y);
		gradient.addColorStop(0, '#1f00ff');
		gradient.addColorStop(1, '#9800ff');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		const buffer = await convert(canvas.toDataURL('image/png'));
		return Promise.resolve(buffer);
	}
	return Promise.reject(new Error('Canvas not available'));
};

export default function createQRCode(text: string, template = 'default') {
	registerFont(fontURL, { family: 'Abstract' });
	const style = Style[template];
	const qrCode = new QRCode({
		...style,
		text: text,
	});
	return qrCode;
}
