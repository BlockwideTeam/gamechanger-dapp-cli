import { resolve } from 'path';
import Root from 'app-root-path';

const logoURL = resolve(
	Root.toString(),
	'./src/assets/images/dapp-logo-bg.png'
);
const backgroundURL = resolve(
	Root.toString(),
	'./src/assets/images/background.png'
);

export const size = 1024;

const defaultTemplate = {
	text: '',
	width: size,
	height: size,
	colorDark: '#000000',
	colorLight: 'rgba(0,0,0,0)',
	drawer: 'canvas',
	logo: logoURL,
	logoWidth: 433,
	logoHeight: 118,
	dotScale: 1,
	logoBackgroundTransparent: true,
	backgroundImage: backgroundURL,
	autoColor: false,
};

type StyleType = {
	[name: string]: { [name: string]: string | undefined | number | boolean };
};

const styles: StyleType = {
	default: defaultTemplate,
	boxed: {
		...defaultTemplate,
		quietZone: 60,
		quietZoneColor: 'rgba(0,0,0,0)',
		title: 'GAME CHANGER',
		subTitle: '-Dapp Connector-',
		titleTop: -25,
		subTitleTop: -8,
		titleHeight: 0,
		titleBackgroundColor: 'rgba(0,0,0,0)',
		titleColor: '#ffffff',
		subTitleColor: '#ffffff',
		titleFont: 'normal normal bold 16px Abstract',
		subTitleFont: 'normal normal bold 9px Abstract',
	},
	printable: {
		...defaultTemplate,
		logo: undefined,
		logoWidth: undefined,
		logoHeight: undefined,
		colorDark: '#000000',
		colorLight: '#ffffff',
		backgroundImage: undefined,
		title: 'GAME CHANGER',
		subTitle: '-Dapp Connector-',
		quietZone: 60,
		quietZoneColor: 'rgba(0,0,0,0)',
		titleTop: -25,
		subTitleTop: -8,
		titleHeight: 0,
		titleBackgroundColor: '#ffffff',
		titleColor: '#000000',
		subTitleColor: '#000000',
		titleFont: 'normal normal bold 16px Abstract',
		subTitleFont: 'normal normal bold 9px Abstract',
	},
};

export default styles;
