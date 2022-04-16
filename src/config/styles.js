import path from "path";
import Root from "app-root-path";

const logoURL = path.resolve(
	Root.toString(),
	"./src/assets/images/qr-logo-black.png"
);
const backgroundURL = path.resolve(
	Root.toString(),
	"./src/assets/images/background.png"
);

export const size = 1024;

const defaultTemplate = {
	text: "",
	width: size,
	height: size,
	colorDark: "#000000",
	colorLight: "rgba(0,0,0,0)",
	drawer: "canvas",
	logo: logoURL,
	logoWidth: size,
	logoHeight: size,
	dotScale: 1,
	logoBackgroundTransparent: true,
	backgroundImage: backgroundURL,
	autoColor: false,
};

export default {
	default: defaultTemplate,
	boxed: {
		...defaultTemplate,
		logo: undefined,
		logoWidth: undefined,
		logoHeight: undefined,
		quietZone: 60,
		quietZoneColor: "rgba(0,0,0,0)",
		title: "GAME CHANGER",
		subTitle: "-Dapp Connector-",
		titleTop: -25,
		subTitleTop: -8,
		titleHeight: 0,
		titleBackgroundColor: "rgba(0,0,0,0)",
		titleColor: "#ffffff",
		subTitleColor: "#ffffff",
		titleFont: "normal normal bold 16px Abstract",
		subTitleFont: "normal normal bold 9px Abstract",
	},
	printable: {
		...defaultTemplate,
		logo: undefined,
		logoWidth: undefined,
		logoHeight: undefined,
		colorDark: "#000000",
		colorLight: "#ffffff",
		backgroundImage: undefined,
		title: "GAME CHANGER",
		subTitle: "-Dapp Connector-",
		quietZone: 60,
		quietZoneColor: "rgba(0,0,0,0)",
		titleTop: -25,
		subTitleTop: -8,
		titleHeight: 0,
		titleBackgroundColor: "#ffffff",
		titleColor: "#000000",
		subTitleColor: "#000000",
		titleFont: "normal normal bold 16px Abstract",
		subTitleFont: "normal normal bold 9px Abstract",
	},
};
