import QRCode from "easyqrcodejs-nodejs";
import jsdom from "jsdom";
import Root from "app-root-path";
import path from "path";
import fs from "fs";
import convert from "data-uri-to-buffer";

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
global["navigator"] = dom.window.Navigator;

const logoURL = path.resolve(
	Root.toString(),
	"./src/assets/images/dapp-logobg.png"
);
const Logo = fs.readFileSync(logoURL);

const size = 1024;
function getBackGround(width) {
	var canvas = document.createElement("canvas"),
		ctx = canvas.getContext("2d"),
		container = document.getElementById("gamearea") || document.body;
	container.appendChild(canvas);
	canvas.width = width;
	canvas.height = width;
	ctx.translate(1, 1);
	var sp = {
			x: 0,
			y: 0,
		},
		ep = {
			x: canvas.width,
			y: canvas.height,
		},
		gradient = ctx.createLinearGradient(sp.x, sp.y, ep.x, ep.y);
	gradient.addColorStop(0, "#1f00ff");
	gradient.addColorStop(1, "#9800ff");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	return ctx;
}

(async () => {
	const background = getBackGround(size);
	fs.writeFileSync("./background.png", convert(background.canvas.toDataURL()));

	var options = {
		width: size,
		height: size,
		colorDark: "#000000",
		colorLight: "rgba(0,0,0,0)",
		text: "https://github.com/ushelp/EasyQRCodeJS",
		drawer: "canvas",
		logo: logoURL,
		logoWidth: 1024,
		logoHeight: 1024,
		logoBackgroundTransparent: true,
		backgroundImage: "./background.png",
		autoColor: false,
		version: 6,
	};

	// Create QRCode Object
	const result = new QRCode(options);

	const image = await result.saveImage({ path: "./testCaca.png" });
	console.log(1);
})();
