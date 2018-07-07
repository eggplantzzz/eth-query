# eth-query

This is a tool for retrieving a report on the last *n* blocks written to the ethereum blockchain.  The report contains information about
the amount of ether transferred in those blocks as well as the addresses sending and receiving ether.
It require node v8.11.2 and npm 6.1.0.

Installing
----------

Clone this git repository. Then cd into the eth-query directory and install the node modules with
```
npm install
```

Create an [Infura](https://infura.io/) account and obtain an api key.  Duplicate the config.example.js file and remove
'.example' from the file name.  Replace 'secretkey' with your api key.

Usage
-----

Require the eth-query.js file in the top-most directory.
```
const ethQuery = require('./eth-query');
```

This module exposes a function that takes a number *n* as an argument.  It then does two things: it logs a report to the console
giving details about the last *n* blocks written to the ethereum blockchain and returns a Promise that
resolves with a more detailed report.  See below for more details about the data.
```
// returns details about the last 5 blocks written
ethQuery(5)
  .then(data => {
    console.log(data);
  });
```

You may also include an optional boolean as a second argument.  If `true` is passed as a second argument, the function
will then return information about which of the transferring addresses were contract addresses.  This is a more
costly operation and defaults to false if no second argument is passed.

```
// returns details about the last 12 blocks in addition to contract information about the addresses
ethQuery(12, true)
  .then(data => {
    console.log(data.contractAddressesThatReceivedEther);
  });
```

The data object structure is as follows...
```
{
  weiTransferred: string containing the toal amount of wei transferred,
  etherTransferred: string containing the total amount of ether transferred,
  addressesThatSentEther: [ array of addresses that sent ether ],
  addressesThatReceivedEther: [ array of addresses that received ether ],
  contractAddressesThatSentEther: [ array of contract addresses that sent ether (only present when second argument is truthy) ],
  contractAddressesThatReceivedEther: [ array of contract addresses that received ether (only present when second argument is truthy) ]
}
```

Running Tests
-------------

The test suite can be run by typing
```
npm test
```
