const Web3 = require('web3');
const config = require('./config');
const { infuraApiKey } = config;
const web3 = new Web3('https://mainnet.infura.io/' + infuraApiKey);

const getLastBlockNumber = () => web3.eth.getBlockNumber();

const getBlockData = (blockNumber) => web3.eth.getBlock(blockNumber, true);

const calculateRelevantBlockNumbers = (numberOfTransactions, lastBlockNumber) => {
  const parsedLastBlockNumber = parseInt(lastBlockNumber);
  let relevantBlockNumbers = [];
  for (let index = 0; index < numberOfTransactions; index++) {
    relevantBlockNumbers.push(lastBlockNumber - index);
  }
  return relevantBlockNumbers;
}

const aggregateData = (blocksData) => {
  const accumulatorInitialValue = {
    etherTransferred: 0,
    addressesThatSentEther: [],
    addressesThatReceivedEther: [],
  }
  return blocksData.reduce((accumulator, currentBlockData) => {
    const etherTransferredInBlock = parseFloat(web3.utils.fromWei(currentBlockData.weiTransferred.toString(16)));
    accumulator.etherTransferred = accumulator.etherTransferred + etherTransferredInBlock;
    accumulator.addressesThatSentEther = accumulator.addressesThatSentEther.concat(currentBlockData.addressesThatSentEther);
    accumulator.addressesThatReceivedEther = accumulator.addressesThatReceivedEther.concat(currentBlockData.addressesThatReceivedEther);
    return accumulator;
  }, accumulatorInitialValue);
}

const collectBlockData = (transactions) => {
  const accumulatorInitialValue = {
    weiTransferred: 0,
    addressesThatSentEther: [],
    addressesThatReceivedEther: [],
  }
  return transactions.reduce((accumulator, currentTransaction) => {
    accumulator.weiTransferred = accumulator.weiTransferred + parseInt(currentTransaction.value);
    accumulator.addressesThatSentEther.push(currentTransaction.to);
    accumulator.addressesThatReceivedEther.push(currentTransaction.from);
    return accumulator;
  }, accumulatorInitialValue);
}

const collectDataOnSingleBlock = (blockNumber) => {
  return getBlockData(blockNumber)
    .then(blockData => blockData.transactions)
    .then(transactions => collectBlockData(transactions))
}

const collectDataOnBlocks = (blockNumbers) => {
  const blocksData = [];
  const arrayLength = blockNumbers.length;
  for (let index = 0; index < arrayLength; index++) {
    blocksData.push(collectDataOnSingleBlock(blockNumbers[index]));
  }
  return Promise.all(blocksData);
}

const etherReportFromLastWrittenBlocks = (numberOfBlocks) => {
  if (numberOfBlocks <= 0) throw new Error('The number of transactions must be positive.');

  getLastBlockNumber()
    .then(lastBlockNumber => calculateRelevantBlockNumbers(numberOfBlocks, lastBlockNumber))
    .then(blockNumbers => collectDataOnBlocks(blockNumbers))
    .then(blocksData => aggregateData(blocksData))
    .then(aggregatedData => createReport(numberOfBlocks, aggregatedData))
    .catch(error => console.log(error));
}

const createReport = (numberOfBlocks, aggregatedData) => {
  const { etherTransferred, addressesThatSentEther, addressesThatReceivedEther } = aggregatedData;
  console.log(`/////////////////////////////////////////////////////////////////////////////`);
  console.log(`|    There was ${etherTransferred} ether transferred in the last ${numberOfBlocks} blocks.               |`);
  console.log(`|    There were ${JSON.stringify(addressesThatSentEther.length)} addresses that sent and received ether. |`);
  console.log(`/////////////////////////////////////////////////////////////////////////////`);
}

const getAccountCode = (accountNumber) => {
  web3.eth.getCode(accountNumber)
    .then(code => console.log('the code is ' + code));
}

const getSampleTransaction = () => {
  getLastBlockNumber()
    .then(getBlockData)
    .then(blockData => console.log('a transaction => ' + JSON.stringify(blockData.transactions[0])));
}

module.exports = {
  getAccountCode,
  getSampleTransaction,
  etherReportFromLastWrittenBlocks,
}
