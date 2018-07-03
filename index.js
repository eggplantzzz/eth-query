const Web3 = require('web3');
const config = require('./config');
const { infuraApiKey } = config;
const web3 = new Web3('https://mainnet.infura.io/' + infuraApiKey);

const getLastBlockNumber = () => web3.eth.getBlockNumber();

const getBlockData = (blockNumber) => web3.eth.getBlock(blockNumber, true);

const computeWeiInTransactions = (transactions) => {
  return transactions.reduce((wei, currentTransaction) => {
    return wei + parseInt(currentTransaction.value);
  }, 0);
}

const etherTransferredInLastBlock = () => {
  getLastBlockNumber()
    .then(getBlockData)
    .then(blockData => blockData.transactions)
    .then(computeWeiInTransactions)
    .then(wei => {
      console.log(`There was ${wei} wei transferred in the last block.`);
      console.log(`This means there was ${web3.utils.fromWei(wei.toString())} ether transferred.`);
    })
    .catch(error => console.log(error));
}

module.exports = {
  etherTransferredInLastBlock,
}
