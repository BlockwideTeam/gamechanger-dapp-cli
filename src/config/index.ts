export const cliName = 'gamechanger-dapp-cli';
export const networks = ['mainnet', 'testnet'];
export const demoGCS = {
  type: 'tx',
  title: 'Demo',
  description: 'created with ' + cliName,
  metadata: {
    '123': {
      message: 'Hello World!',
    },
  },
};
export const demoPacked =
  'woTCpHR5cGXConR4wqV0aXRsZcKkRGVtb8KrZGVzY3JpcMSKb27DmSHEmGVhdGVkIHfEi2ggZ2FtZWNoYW5nZXItZGFwcC1jbGnCqMSudGHEuMWCwoHCozEyM8KBwqfErnNzYcS0wqxIZWxsbyBXb3JsZCE';
export const escapeShellArg = (arg: string) =>
  // eslint-disable-next-line quotes
  `'${arg.replace(/'/g, "'\\''")}'`;

export const usageMessage = `
GameChanger Wallet CLI:
	Harness the power of Cardano with this simple dApp connector generator for GameChanger Wallet.
	Build GCscripts, JSON-based scripts that gets packed into ready to use URL dApp connectors!

Usage
	$ ${cliName} [network] [action] [subaction]

Networks: ${networks.map((x) => `'${x}'`).join(' | ')}

Actions:
	'build':
		'url'     : generates a ready to use URL dApp connector from a valid GCScript
		'qr'      : generates a ready to use URL dApp connector encoded into a QR code image from a valid GCScript
		'html'    : generates a ready to use HTML dApp with a URL connector from a valid GCScript
		'button'  : generates a ready to use HTML embeddable button snippet with a URL connector from a valid GCScript
		'nodejs'  : generates a ready to use Node JS dApp with a URL connector from a valid GCScript
		'react'   : generates a ready to use React dApp with a URL connector from a valid GCScript
Options:
	--args [gcscript] | -a [gcscript]:  Load GCScript from arguments
	--file [filename] | -a [filename]:  Load GCScript from file
	without --args or --file         :  Load GCScript from stdin

	--outputFile [filename] -o [filename]:  The QR Code, HTML, button, nodejs, or react output filename
	without --outputFile                 :  Sends the QR Code, HTML, button, nodejs, or react output file to stdin

	--template [template name] | -t [template name]: default, boxed or printable

Examples

	$ ${cliName} mainnet build url -f demo.gcs
	https://wallet.gamechanger.finance/api/1/tx/${demoPacked}

	$ ${cliName} testnet build url -a ${escapeShellArg(JSON.stringify(demoGCS))}
	https://testnet-wallet.gamechanger.finance/api/1/tx/${demoPacked}

	$ cat demo.gcs | ${cliName} mainnet build url
	https://wallet.gamechanger.finance/api/1/tx/${demoPacked}

	$ ${cliName} testnet build qr -a ${escapeShellArg(JSON.stringify(demoGCS))}
	https://testnet-wallet.gamechanger.finance/api/1/tx/${demoPacked} > qr_output.png

	$ ${cliName} testnet build qr -a ${escapeShellArg(JSON.stringify(demoGCS))}
	https://testnet-wallet.gamechanger.finance/api/1/tx/${demoPacked} -o qr_output.png
`;
