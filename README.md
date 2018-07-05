# eth-query

This is a tool for retrieving a report on the last n blocks written to the ethereum blockchain.  The report contains
the amount of ether transferred in those blocks, the number of unique addresses sending and receiving ether and the
number of those addresses that were contract addresses.

Installing

Clone this git repository. Then cd into eth-query and install the node modules with
```
npm install
```

Usage

Open a node console and require eth-query.js in the top-most directory.
```
const ethQuery = require('eth-query');
```

This module exposes a function that takes a number n as an argument.  It then returns a report giving details about
the last n blocks written to the ethereum blockchain.
```
// returns details about the last 5 blocks written
ethQuery(5)
```
