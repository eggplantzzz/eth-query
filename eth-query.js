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
  validateInput,
} = require('./lib');

const etherReportFromLastWrittenBlocks = (numberOfBlocks, returnJson = false) => {
  try {
    validateInput(numberOfBlocks);
  } catch (error) {
    throw new Error(error);
  }
  return calculateRelevantBlockNumbers(numberOfBlocks, web3)
    .then(relevantBlockNumbers => collectDataOnBlocks(relevantBlockNumbers, web3))
    .then(blocksData => aggregateAllBlocksData(blocksData, web3))
    .then(filterDuplicateAddresses)
    .then(filteredAggregatedData => determineAllContractAddresses(filteredAggregatedData, web3))
    .then(preparedData => createReport(numberOfBlocks, preparedData, returnJson))
    .catch(error => console.log(error));
}

module.exports = etherReportFromLastWrittenBlocks;
