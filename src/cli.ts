#!/usr/bin/env node  --no-warnings
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
	const [network, action, subAction] = cli.input;
	if (!networks.includes(network)) {
		throw new Error('Unknown Cardano network specification');
	}

	if (!actions.includes(action)) {
		throw new Error('Unknown action');
	}

	if (!Object.keys(actionsHandlers[action]).includes(subAction)) {
		throw new Error(`Unknown sub action for action '${action}'`);
	}

	const source = cli.flags.args ? 'args' : cli.flags.file ? 'file' : 'stdin';

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
