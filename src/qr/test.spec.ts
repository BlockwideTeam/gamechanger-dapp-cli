import execa from 'execa';
import { expect } from 'chai';

describe('GameChanger DAPP CLI', function () {
	it('should build the correct url for the demo.gcs script', async function () {
		const { stdout } = await execa('./dist/cli.js', [
			'mainnet',
			'build',
			'url',
			'-f',
			'demo.gcs',
		]);
		expect(stdout).to.equal(
			'https://wallet.gamechanger.finance/api/1/tx/woTCpHR5cGXConR4wqV0aXRsZcKkRGVtb8KrZGVzY3JpcMSKb27DmSHEmGVhdGVkIHfEi2ggZ2FtZWNoYW5nZXItZGFwcC1jbGnCqMSudGHEuMWCwoHCozEyM8KBwqfErnNzYcS0wqxIZWxsbyBXb3JsZCE'
		);
	});
});
