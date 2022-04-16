import meow from 'meow';
import fs from 'fs';
import getStdin from 'get-stdin';

import { ActionHandlerType, ExecuteType, SourceType } from '../types';

import ButtonHandler from './button';
import HtmlHandler from './html';
import NodeHandler from './nodejs';
import ReactHandler from './react';
import UrlHandler from './url';
import QRHandler from './qr';
import { usageMessage } from '../config';

export const execute = async ({ network, action, source }: ExecuteType) => {
  const inputData = await source();
  return action({ network, inputData });
};

export const cli = meow(usageMessage, {
  importMeta: import.meta,
  help: usageMessage,
  autoHelp: true,
  flags: {
    args: {
      type: 'string',
      alias: 'a',
    },
    file: {
      type: 'string',
      alias: 'f',
    },
    stdin: {
      type: 'string',
      alias: 'i',
    },
    outputFile: {
      type: 'string',
      alias: 'o',
    },
    template: {
      type: 'string',
      alias: 't',
    },
  },
});

export const sourcesHandlers: SourceType = {
  args: () => Promise.resolve(cli.flags.args),
  file: () => {
    const filename = cli.flags.file;
    return new Promise((resolve, reject) => {
      if (typeof filename === 'string') {
        fs.readFile(filename, 'utf8', (err, data) => {
          if (err)
            return reject(
              new Error('Failed to read from stdin.' + err.message)
            );
          return resolve(data.toString());
        });
      } else {
        return reject(new Error('Undefined file'));
      }
    });
  },
  stdin: () => getStdin(),
  outputFile: () => Promise.resolve(cli.flags.outputFile),
};

export const actionsHandlers: ActionHandlerType = {
  build: {
    url: UrlHandler,
    qr: QRHandler,
    button: ButtonHandler,
    html: HtmlHandler,
    nodejs: NodeHandler,
    react: ReactHandler,
  },
};
