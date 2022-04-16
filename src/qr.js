import "node-self";
import QRCode from "easyqrcodejs-nodejs";
import jsdom from "jsdom";
import Style from "./config/styles.js";
import convert from "data-uri-to-buffer";
import styles from "./config/styles.js";

const { JSDOM } = jsdom;

const dom = new JSDOM(
	`<!doctype html><html lang="en"><head></head><body></body></html>`
);

global["window"] = dom.window;
global["document"] = dom.window.document;
global["self"] = dom.window;
global["Image"] = dom.window.Image;
global["XMLSerializer"] = dom.window.XMLSerializer;
global["btoa"] = (str) => Buffer.from(str, "binary").toString("base64");

export async function getBackGround(width = styles.defaultOptions.width) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	const container = document.getElementById("gamearea") || document.body;

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
	gradient.addColorStop(0, "#1f00ff");
	gradient.addColorStop(1, "#9800ff");

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const buffer = await convert(canvas.toDataURL("image/png"));

	return Promise.resolve(buffer);
}

export default function createQRCode(options = {}) {
	const qrCode = new QRCode({
		...Style.defaultOptions,
		...options,
	});
	return qrCode;
}
