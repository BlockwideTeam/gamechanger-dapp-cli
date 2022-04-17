import test from 'ava';
import execa from 'execa';

test('main', async (t) => {
	const { stdout } = await execa('./dist/cli.js', [
		'mainnet',
		'build',
		'url',
		'-f',
		'demo.gcs',
	]);
	t.is(
		stdout,
		'https://wallet.gamechanger.finance/api/1/tx/woTCpHR5cGXConR4wqV0aXRsZcKkRGVtb8KrZGVzY3JpcMSKb27DmSHEmGVhdGVkIHfEi2ggZ2FtZWNoYW5nZXItZGFwcC1jbGnCqMSudGHEuMWCwoHCozEyM8KBwqfErnNzYcS0wqxIZWxsbyBXb3JsZCE'
	);
});
