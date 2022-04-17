import Codec from 'json-url';
import path from 'path';

import { HandlerInputType } from '../types';

const codec = Codec('lzw');

import createQRCode from '../qr';
import { cli } from '.';
import styles from '../config/styles';

export default async ({ network, inputData }: HandlerInputType) => {
	let jsoned;
	try {
		if (!inputData) {
			throw new Error('Empty GCScript provided');
		}
		jsoned = JSON.parse(inputData);
	} catch (err) {
		if (err instanceof Error) {
			throw new Error('Invalid GCScript. ' + err.message);
		}
	}

	try {
		const gcscript = await codec.compress(jsoned);
		let url;
		if (network === 'mainnet')
			url = 'https://wallet.gamechanger.finance/api/1/tx/' + gcscript;
		else if (network === 'testnet')
			url = 'https://testnet-wallet.gamechanger.finance/api/1/tx/' + gcscript;
		else throw new Error('Unknown Cardano network specification');

		const template =
			cli.flags.template && styles[cli.flags.template]
				? cli.flags.template
				: 'default';

		const qrCode = createQRCode(url, template);

		if (cli.flags.styles) {
			let extendedStyle = {};
			try {
				extendedStyle = JSON.parse(cli.flags.styles);
			} finally {
				qrCode.changeStyles(extendedStyle);
			}
		}

		if (cli.flags.outputFile) {
			await qrCode.saveImage({
				path: path.resolve(process.cwd(), `./${cli.flags.outputFile}`),
			});
		} else {
			const stream = await qrCode.toStream();
			stream.pipe(process.stdout);
		}
	} catch (err) {
		if (err instanceof Error) {
			throw new Error('Wrong QR Generation. ' + err.message);
		}
	}
};
