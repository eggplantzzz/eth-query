const Web3 = require('web3');
const config = require('./config');
const { infuraApiKey } = config;
const web3 = new Web3('https://mainnet.infura.io/' + infuraApiKey);

const getLastBlockNumber = () => web3.eth.getBlockNumber();

const getBlockData = (blockNumber) => web3.eth.getBlock(blockNumber, true);

const calculateAmountOfWeiInTransactions = (transactions) => {
  return transactions.reduce((wei, currentTransaction) => {
    return wei + parseInt(currentTransaction.value);
  }, 0);
}

const calculateRelevantBlockNumbers = (numberOfTransactions, lastBlockNumber) => {
  const parsedLastBlockNumber = parseInt(lastBlockNumber);
  let relevantBlockNumbers = [];
  for (let index = 0; index < numberOfTransactions; index++) {
    relevantBlockNumbers.push(lastBlockNumber - index);
  }
  return relevantBlockNumbers;
}

const sumAllValues = (array) => {
  return array.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0)
}

const weiTransferredInBlocks = (blockNumbers) => {
  const weiValues = [];
  const arrayLength = blockNumbers.length;
  for (let index = 0; index < arrayLength; index++) {
    weiValues.push(weiTransferredInBlock(blockNumbers[index]));
  }
  return Promise.all(weiValues);
}

const weiTransferredInBlock = (blockNumber) => {
  return getBlockData(blockNumber)
    .then(blockData => blockData.transactions)
    .then(calculateAmountOfWeiInTransactions)
    .then(wei => {
      const ether = web3.utils.fromWei(wei.toString());
      console.log(`${ether} ether transferred in block number ${blockNumber}`);
      return wei;
    });
}

const etherTransferredInLastTransactions = (numberOfTransactions) => {
  if (numberOfTransactions <= 0) throw new Error('The number of transactions must be positive.');

  getLastBlockNumber()
    .then(lastBlockNumber => calculateRelevantBlockNumbers(numberOfTransactions, lastBlockNumber))
    .then(blockNumbers => weiTransferredInBlocks(blockNumbers))
    .then(weiValues => sumAllValues(weiValues))
    .then(totalWei => {
      const totalEther = web3.utils.fromWei(totalWei.toString());
      console.log(`There was ${totalEther} ether transferred in the last ${numberOfTransactions} transactions.`);
      return totalEther;
    })
    .catch(error => console.log(error));
}

module.exports = etherTransferredInLastTransactions;
