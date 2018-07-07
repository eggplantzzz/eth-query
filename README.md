# eth-query

This is a tool for retrieving a report on the last n blocks written to the ethereum blockchain.  The report contains
the amount of ether transferred in those blocks, the number of unique addresses sending and receiving ether and the
number of those addresses that were contract addresses.

Installing
----------

Clone this git repository. Then cd into eth-query and install the node modules with
```
npm install
```

Usage
-----

Require eth-query.js in the top-most directory.
```
const ethQuery = require('eth-query');
```

This module exposes a function that takes a number *n* as an argument.  It then logs a report to the console
giving details about the last *n* blocks written to the ethereum blockchain.
```
// returns details about the last 5 blocks written
ethQuery(5)
```

You may include an optional boolean as a second argument.  If `true` is passed as a second argument, the function
will then return a Promise that resolves with an object with more detailed information regarding the last *n* blocks.

```
ethQuery(12)
  .then(data => {
    console.log(data);
  });
```

The data object structure is as follows...
```
{
  etherTransferred: number of total ether transferred,
  addressesThatSentEther: [ array of addresses that sent ether ],
  addressesThatReceivedEther: [ array of addresses that received ether ],
  contractAddressesThatSentEther: [ array of contract addresses that sent ether ],
  contractAddressesThatReceivedEther: [ array of contract addresses that received ether ]
}
```

Running Tests
-------------

The test suite can be run by typing
```
npm test
```
