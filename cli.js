#!/usr/bin/env node

import meow from 'meow';
import getStdin from 'get-stdin';
import fs from 'fs';
import jsdom from 'jsdom';
import imageDataURI from 'image-data-uri';

const { JSDOM } = jsdom;

const dom = new JSDOM(`<!doctype html><html lang="en"><head></head><body></body></html>`);
global['window'] = dom.window;
global['document'] = dom.window.document;
global['self'] = dom.window;
global['Image'] = dom.window.Image;
global['XMLSerializer'] = dom.window.XMLSerializer;
global['btoa'] = (str) => Buffer.from(str, 'binary').toString('base64');

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const codec = require('json-url')('lzw');
const QRCodeStyling = require("qr-code-styling-node");
const nodeCanvas = require("canvas");

const Logo = fs.readFileSync('./src/assets/images/logoBlack.png');

const size = 300;
const styling={
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
	"image": imageDataURI.encode(Logo, 'PNG'),//"https://ipfs.io/ipfs/QmVPpS1gXXDMNo1x5hXoXgfcwzfVXScy67vSqL4kNPC99v",
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
const qrCode = new QRCodeStyling({
	nodeCanvas,
	...styling
});

const cliName='gamechanger-dapp-cli';
function escapeShellArg (arg) {
    return `'${arg.replace(/'/g, `'\\''`)}'`;
}
const actionsHandlers={
	'build':{
		'url':({network,inputData})=>{
			let jsoned;
			try{
				if(!inputData)
					throw new Error('Empty GCScript provided')
				jsoned=JSON.parse(inputData);
			}
			catch(err){
				throw new Error("Invalid GCScript. "+err.message);
			}
			return codec.compress(jsoned)
			.then(gcscript => {
				let url;
				if(network==='mainnet')
					url="https://wallet.gamechanger.finance/api/1/tx/"+gcscript;
				else
				if(network==='testnet')
					url="https://testnet-wallet.gamechanger.finance/api/1/tx/"+gcscript;
				else
					throw new Error('Unknown Cardano network specification');
				console.info(url);
				return url;
			})
			.catch(err => {
				throw new Error("URL generation failed." + err.message);
			})
		},
		'qr':async ({network,inputData}) => {
			let jsoned;
			try{
				if(!inputData)
					throw new Error('Empty GCScript provided')
				jsoned=JSON.parse(inputData);
			}
			catch(err){
				throw new Error("Invalid GCScript. "+err.message);
			}

			try {
				const gcscript = await codec.compress(jsoned);
				let url;
				if(network==='mainnet')
					url="https://wallet.gamechanger.finance/api/1/tx/"+gcscript;
				else if(network==='testnet')
					url="https://testnet-wallet.gamechanger.finance/api/1/tx/"+gcscript;
				else
					throw new Error('Unknown Cardano network specification');

					qrCode.update({data: url})
					const qrBuffer =  await qrCode.getRawData('png');

					if (cli.flags.outputFile) {
						fs.writeFileSync(`./${cli.flags.outputFile}`, qrBuffer)
					}else {
						console.log(qrBuffer.toString('binary'))
					}
			} catch (err) {
				throw new Error("Wrong QR Generation. " + err.message);
			}
		},
		'button':({network,inputData})=>{
			//TODO: implement this
			throw new Error("HTML dApp connector button generation failed. Not implemented yet");
		},
		'html':({network,inputData})=>{
			//TODO: implement this
			throw new Error("HTML generation failed. Not implemented yet");
		},
		'nodejs':({network,inputData})=>{
			//TODO: implement this
			throw new Error("NodeJS generation failed. Not implemented yet");
		},
		'react':({network,inputData})=>{
			//TODO: implement this
			throw new Error("React generation failed. Not implemented yet");
		}

	}
}
const sourcesHandlers={
	'args': ()=>Promise.resolve(cli.flags.args ),
	'file': ()=>{
		const filename=cli.flags.file;
		return new Promise((resolve,reject)=>{
			fs.readFile(filename,'utf8',(err,data)=>{
				if(err)
					return reject( new Error("Failed to read from stdin." + err.message));
				return resolve(data.toString());
			});
		})

	},
	'stdin':()=>getStdin(),
	"outputFile": () => Promise.resolve(cli.flags.outputFile)
}
const networks=['mainnet','testnet'];
const actions=Object.keys(actionsHandlers);
const sources=Object.keys(sourcesHandlers);

const demoGCS={
    "type": "tx",
	"title": "Demo",
	"description":"created with "+ cliName,
    "metadata": {
        "123": {
            "message": "Hello World!"
        }
    }
}
const demoPacked='woTCpHR5cGXConR4wqV0aXRsZcKkRGVtb8KrZGVzY3JpcMSKb27DmSHEmGVhdGVkIHfEi2ggZ2FtZWNoYW5nZXItZGFwcC1jbGnCqMSudGHEuMWCwoHCozEyM8KBwqfErnNzYcS0wqxIZWxsbyBXb3JsZCE'
const usageMsg=`
GameChanger Wallet CLI:
	Harness the power of Cardano with this simple dApp connector generator for GameChanger Wallet.
	Build GCscripts, JSON-based scripts that gets packed into ready to use URL dApp connectors!

Usage
	$ ${cliName} [network] [action] [subaction]

Networks: ${networks.map(x=>`'${x}'`).join(' | ')}

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
	--outputFile [filename] -o [filename]:  The QR Code output filename
	without --args or --file         :  Load GCScript from stdin

Examples

	$ ${cliName} mainnet build url -f demo.gcs
	https://wallet.gamechanger.finance/api/1/tx/${demoPacked}

	$ ${cliName} testnet build url -a ${escapeShellArg(JSON.stringify(demoGCS))}
	https://testnet-wallet.gamechanger.finance/api/1/tx/${demoPacked}

	$ cat demo.gcs | ${cliName} mainnet build url
	https://wallet.gamechanger.finance/api/1/tx/${demoPacked}
`;


process.on('uncaughtException', function(err) {
	console.error('Error: ' + err.message);
	console.error(usageMsg);
});


const execute=async ({
	network,
	action,
	source,
})=>{
	const inputData=await source();
	return action({network,inputData});
}

const cli = meow(usageMsg, {
	importMeta: import.meta,
	//allowUnknownFlags:false,
	help:usageMsg,
	autoHelp:true,
	flags: {
		args:{
			type: 'string',
			alias:'a',
		},
		file:{
			type: 'string',
			alias:'f',
		},
		stdin:{
			type: 'string',
			alias:'i',
		},
		outputFile:{ // Not used yet, for example will be used with QR code
			type: 'string',
			alias:'o',
		},
	}
});


const network=cli.input[0];
if(!networks.includes(network))
	throw new Error('Unknown Cardano network specification')
const action=cli.input[1];
if(!actions.includes(action))
	throw new Error('Unknown action')
const subAction=cli.input[2];
if(!Object.keys(actionsHandlers[action]).includes(subAction))
	throw new Error(`Unknown sub action for action '${action}'`);
let source;
if(cli.flags.args)
	source='args';
else
if (cli.flags.file)
	source='file';
else
	source='stdin';

const actionResolver=actionsHandlers[action][subAction];
const sourceResolver=sourcesHandlers[source];
execute({
	network,
	action:actionResolver,
	source:sourceResolver,
});
