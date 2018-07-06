const Web3 = require('web3');
const { infuraApiKey } = require('./config');
const web3 = new Web3('https://mainnet.infura.io/' + infuraApiKey);
const {
  aggregateAllBlocksData,
  calculateRelevantBlockNumbers,
  collectDataOnBlocks,
  createReport,
  filterDuplicateAddresses,
  determineAllContractAddresses,
} = require('./lib');

const etherReportFromLastWrittenBlocks = (numberOfBlocks) => {
  if (numberOfBlocks <= 0) throw new Error('The number of transactions must be positive.');
  calculateRelevantBlockNumbers(numberOfBlocks, web3)
    .then(relevantBlockNumbers => collectDataOnBlocks(relevantBlockNumbers, web3))
    .then(blocksData => aggregateAllBlocksData(blocksData, web3))
    .then(filterDuplicateAddresses)
    .then(filteredAggregatedData => determineAllContractAddresses(filteredAggregatedData, web3))
    .then(preparedData => createReport(numberOfBlocks, preparedData))
    .catch(error => console.log(error));
}

const getCode = (code) => {
  web3.eth.getCode(code)
    .then(code => console.log(code));
}

module.exports = {
  etherReportFromLastWrittenBlocks,
  getCode,
}
