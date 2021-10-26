# GameChanger Wallet CLI

> Harness the power of Cardano with this simple dApp connector generator for GameChanger Wallet. Build GCscripts, JSON-based scripts that gets packed into ready to use URL dApp connectors!

## Install

```
$ npm install --global gamechanger-dapp-cli
```

## Usage

```
$ gamechanger-dapp-cli [network] [action] [subaction]

Networks: 'mainnet' | 'testnet'

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

        $ gamechanger-dapp-cli mainnet build url -f demo.gcs
        https://wallet.gamechanger.finance/api/1/tx/woTCpHR5cGXConR4wqV0aXRsZcKkRGVtb8KrZGVzY3JpcMSKb27DmSHEmGVhdGVkIHfEi2ggZ2FtZWNoYW5nZXItZGFwcC1jbGnCqMSudGHEuMWCwoHCozEyM8KBwqfErnNzYcS0wqxIZWxsbyBXb3JsZCE

        $ gamechanger-dapp-cli testnet build url -a '{"type":"tx","title":"Demo","description":"created with gamechanger-dapp-cli","metadata":{"123":{"message":"Hello World!"}}}'
        https://testnet-wallet.gamechanger.finance/api/1/tx/woTCpHR5cGXConR4wqV0aXRsZcKkRGVtb8KrZGVzY3JpcMSKb27DmSHEmGVhdGVkIHfEi2ggZ2FtZWNoYW5nZXItZGFwcC1jbGnCqMSudGHEuMWCwoHCozEyM8KBwqfErnNzYcS0wqxIZWxsbyBXb3JsZCE

        $ cat demo.gcs | gamechanger-dapp-cli mainnet build url
        https://wallet.gamechanger.finance/api/1/tx/woTCpHR5cGXConR4wqV0aXRsZcKkRGVtb8KrZGVzY3JpcMSKb27DmSHEmGVhdGVkIHfEi2ggZ2FtZWNoYW5nZXItZGFwcC1jbGnCqMSudGHEuMWCwoHCozEyM8KBwqfErnNzYcS0wqxIZWxsbyBXb3JsZCE

	$ gamechanger-dapp-cli testnet build qr -a '{"type":"tx","title":"Demo","description":"created with gamechanger-dapp-cli","metadata":{"123":{"message":"Hello World!"}}}'

	$ gamechanger-dapp-cli testnet build qr -a '{"type":"tx","title":"Demo","description":"created with gamechanger-dapp-cli","metadata":{"123":{"message":"Hello World!"}}}' -o qr_output.png
```
