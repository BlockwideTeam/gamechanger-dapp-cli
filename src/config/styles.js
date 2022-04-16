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
const size = 1024;

export default {
	defaultOptions: {
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
	},
};
