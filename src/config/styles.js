import path from 'path';
import fs from 'fs';
import ImageDataURI from 'image-data-uri';
import Root from 'app-root-path';


const logoURL = path.resolve(Root.toString(),'./src/assets/images/dapp-logo.png');
const Logo = fs.readFileSync(logoURL);
const size = 1024;

export default {
	"width": size,
	"height": size,
	"data": "",
	"margin": size*0.05,
	"qrOptions": {
		"typeNumber": "0",
		"mode": "Byte",
		"errorCorrectionLevel": "Q"
	},
	"imageOptions": {
		"hideBackgroundDots": true,
		"imageSize": 0.3,
		"margin": 2//0.1
	},
	"dotsOptions": {
		"type": "square",
		"color": "#000000",
		"gradient": null
	},
	"backgroundOptions": {
		"color": "#ffffff",
		"gradient": {
			"type": "linear",
			"rotation": 0,
			"colorStops": [{
				"offset": 0,
				"color": "#1f00ff"
			}, {
				"offset": 1,
				"color": "#9800ff"
			}]
		}
	},
	"image": ImageDataURI.encode(Logo, 'PNG'),
	"dotsOptionsHelper": {
		"colorType": {
			"single": true,
			"gradient": false
		},
		"gradient": {
			"linear": true,
			"radial": false,
			"color1": "#6a1a4c",
			"color2": "#6a1a4c",
			"rotation": "0"
		}
	},
	"cornersSquareOptions": {
		"type": "",
		"color": "#000000"
	},
	"cornersSquareOptionsHelper": {
		"colorType": {
			"single": true,
			"gradient": false
		},
		"gradient": {
			"linear": true,
			"radial": false,
			"color1": "#000000",
			"color2": "#000000",
			"rotation": "0"
		}
	},
	"cornersDotOptions": {
		"type": "square",
		"color": "#000000"
	},
	"cornersDotOptionsHelper": {
		"colorType": {
			"single": true,
			"gradient": false
		},
		"gradient": {
			"linear": true,
			"radial": false,
			"color1": "#000000",
			"color2": "#000000",
			"rotation": "0"
		}
	},
	"backgroundOptionsHelper": {
		"colorType": {
			"single": true,
			"gradient": false
		},
		"gradient": {
			"linear": true,
			"radial": false,
			"color1": "#ffffff",
			"color2": "#ffffff",
			"rotation": "0"
		}
	}
}
