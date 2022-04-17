import Codec from 'json-url';

import { HandlerInputType } from '../types';

const codec = Codec('lzw');

export default ({ network, inputData }: HandlerInputType) => {
	let jsoned;
	try {
		if (!inputData) throw new Error('Empty GCScript provided');
		jsoned = JSON.parse(inputData);
	} catch (err) {
		if (err instanceof Error) {
			throw new Error('Invalid GCScript. ' + err.message);
		}
	}
	return codec
		.compress(jsoned)
		.then((gcscript: string) => {
			let url;
			if (network === 'mainnet')
				url = 'https://wallet.gamechanger.finance/api/1/tx/' + gcscript;
			else if (network === 'testnet')
				url = 'https://testnet-wallet.gamechanger.finance/api/1/tx/' + gcscript;
			else throw new Error('Unknown Cardano network specification');
			console.info(url);
			return url;
		})
		.catch((err: Error) => {
			throw new Error('URL generation failed.' + err.message);
		});
};
