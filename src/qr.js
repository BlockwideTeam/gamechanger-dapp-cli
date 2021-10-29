import 'node-self';
import QRCodeStyling from 'qr-code-styling-node';
import canvas from 'node-canvas';
import jsdom from 'jsdom';

import styling from './config/styles.js';

const { JSDOM } = jsdom;

const dom = new JSDOM(`<!doctype html><html lang="en"><head></head><body></body></html>`);

global['window'] = dom.window;
global['document'] = dom.window.document;
global['self'] = dom.window;
global['Image'] = dom.window.Image;
global['XMLSerializer'] = dom.window.XMLSerializer;
global['btoa'] = (str) => Buffer.from(str, 'binary').toString('base64');

function createQRCode() {
	const qrCode = new QRCodeStyling({
		nodeCanvas: canvas,
		jsdom: JSDOM,
		...styling
	});
	return qrCode;
}

export default createQRCode;
