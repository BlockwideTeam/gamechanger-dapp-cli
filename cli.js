#!/bin/sh
":"; //; exec "$(command -v node)" "--experimental-modules" "--no-warnings" "$0" "$@"

import meow from "meow";
import getStdin from "get-stdin";
import fs from "fs";
import Codec from "json-url";
import path from "path";
import createQRCode from "./src/qr.js";

const codec = Codec("lzw");
const cliName = "gamechanger-dapp-cli";

function escapeShellArg(arg) {
	return `'${arg.replace(/'/g, `'\\''`)}'`;
}

const actionsHandlers = {
	build: {
		url: ({ network, inputData }) => {
			let jsoned;
			try {
				if (!inputData) throw new Error("Empty GCScript provided");
				jsoned = JSON.parse(inputData);
			} catch (err) {
				throw new Error("Invalid GCScript. " + err.message);
			}
			return codec
				.compress(jsoned)
				.then((gcscript) => {
					let url;
					if (network === "mainnet")
						url = "https://wallet.gamechanger.finance/api/1/tx/" + gcscript;
					else if (network === "testnet")
						url =
							"https://testnet-wallet.gamechanger.finance/api/1/tx/" + gcscript;
					else throw new Error("Unknown Cardano network specification");
					console.info(url);
					return url;
				})
				.catch((err) => {
					throw new Error("URL generation failed." + err.message);
				});
		},
		qr: async ({ network, inputData }) => {
			let jsoned;
			try {
				if (!inputData) {
					throw new Error("Empty GCScript provided");
				}
				jsoned = JSON.parse(inputData);
			} catch (err) {
				throw new Error("Invalid GCScript. " + err.message);
			}

			try {
				const gcscript = await codec.compress(jsoned);
				let url;
				if (network === "mainnet")
					url = "https://wallet.gamechanger.finance/api/1/tx/" + gcscript;
				else if (network === "testnet")
					url =
						"https://testnet-wallet.gamechanger.finance/api/1/tx/" + gcscript;
				else throw new Error("Unknown Cardano network specification");
				const qrCode = createQRCode({
					text: url,
				});

				if (cli.flags.outputFile) {
					await qrCode.saveImage({
						path: path.resolve(process.cwd(), `./${cli.flags.outputFile}`),
					});
				} else {
					const stream = await qrCode.toStream();
					stream.pipe(process.stdout);
				}
			} catch (err) {
				throw new Error("Wrong QR Generation. " + err.message);
			}
		},
		button: ({ network, inputData }) => {
			//TODO: implement this
			throw new Error(
				"HTML dApp connector button generation failed. Not implemented yet"
			);
		},
		html: ({ network, inputData }) => {
			//TODO: implement this
			throw new Error("HTML generation failed. Not implemented yet");
		},
		nodejs: ({ network, inputData }) => {
			//TODO: implement this
			throw new Error("NodeJS generation failed. Not implemented yet");
		},
		react: ({ network, inputData }) => {
			//TODO: implement this
			throw new Error("React generation failed. Not implemented yet");
		},
	},
};
const sourcesHandlers = {
	args: () => Promise.resolve(cli.flags.args),
	file: () => {
		const filename = cli.flags.file;
		return new Promise((resolve, reject) => {
			fs.readFile(filename, "utf8", (err, data) => {
				if (err)
					return reject(new Error("Failed to read from stdin." + err.message));
				return resolve(data.toString());
			});
		});
	},
	stdin: () => getStdin(),
	outputFile: () => Promise.resolve(cli.flags.outputFile),
};
const networks = ["mainnet", "testnet"];
const actions = Object.keys(actionsHandlers);
const sources = Object.keys(sourcesHandlers);

const demoGCS = {
	type: "tx",
	title: "Demo",
	description: "created with " + cliName,
	metadata: {
		123: {
			message: "Hello World!",
		},
	},
};
const demoPacked =
	"woTCpHR5cGXConR4wqV0aXRsZcKkRGVtb8KrZGVzY3JpcMSKb27DmSHEmGVhdGVkIHfEi2ggZ2FtZWNoYW5nZXItZGFwcC1jbGnCqMSudGHEuMWCwoHCozEyM8KBwqfErnNzYcS0wqxIZWxsbyBXb3JsZCE";
const usageMsg = `
GameChanger Wallet CLI:
	Harness the power of Cardano with this simple dApp connector generator for GameChanger Wallet.
	Build GCscripts, JSON-based scripts that gets packed into ready to use URL dApp connectors!

Usage
	$ ${cliName} [network] [action] [subaction]

Networks: ${networks.map((x) => `'${x}'`).join(" | ")}

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

process.on("uncaughtException", function (err) {
	console.error("Error: " + err.message);
	console.error(usageMsg);
});

const execute = async ({ network, action, source }) => {
	const inputData = await source();
	return action({ network, inputData });
};

const cli = meow(usageMsg, {
	importMeta: import.meta,
	help: usageMsg,
	autoHelp: true,
	flags: {
		args: {
			type: "string",
			alias: "a",
		},
		file: {
			type: "string",
			alias: "f",
		},
		stdin: {
			type: "string",
			alias: "i",
		},
		outputFile: {
			type: "string",
			alias: "o",
		},
	},
});

try {
	const network = cli.input[0];
	if (!networks.includes(network)) {
		throw new Error("Unknown Cardano network specification");
	}
	const action = cli.input[1];
	if (!actions.includes(action)) {
		throw new Error("Unknown action");
	}

	const subAction = cli.input[2];
	if (!Object.keys(actionsHandlers[action]).includes(subAction)) {
		throw new Error(`Unknown sub action for action '${action}'`);
	}

	let source;
	if (cli.flags.args) {
		source = "args";
	} else if (cli.flags.file) {
		source = "file";
	} else {
		source = "stdin";
	}

	const actionResolver = actionsHandlers[action][subAction];
	const sourceResolver = sourcesHandlers[source];

	execute({
		network,
		action: actionResolver,
		source: sourceResolver,
	});
} catch (err) {
	console.error("Error: " + err.message);
	console.error(usageMsg);
	process.exit(1);
}
