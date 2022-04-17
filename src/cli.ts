#!/usr/bin/env node --experimental-modules --no-warnings --experimental-specifier-resolution=node
import { networks, usageMessage } from './config/index.js';
import {
	actionsHandlers,
	cli,
	sourcesHandlers,
	execute,
} from './handlers/index.js';

const actions = Object.keys(actionsHandlers);

process.on('uncaughtException', function (err) {
	console.error('Error: ' + err.message);
	console.error(usageMessage);
});

try {
	const network: string = cli.input[0];
	if (!networks.includes(network)) {
		throw new Error('Unknown Cardano network specification');
	}
	const action: string = cli.input[1];
	if (!actions.includes(action)) {
		throw new Error('Unknown action');
	}

	const subAction = cli.input[2];
	if (!Object.keys(actionsHandlers[action]).includes(subAction)) {
		throw new Error(`Unknown sub action for action '${action}'`);
	}

	let source;
	if (cli.flags.args) {
		source = 'args';
	} else if (cli.flags.file) {
		source = 'file';
	} else {
		source = 'stdin';
	}

	const actionResolver = actionsHandlers[action][subAction];
	const sourceResolver = sourcesHandlers[source];

	execute({
		network,
		action: actionResolver,
		source: sourceResolver,
	});
} catch (err) {
	if (err instanceof Error) {
		console.error('Error: ' + err.message);
		console.error(usageMessage);
	}
	process.exit(1);
}

export default {};
