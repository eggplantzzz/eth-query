const Web3 = require('web3');
const { infuraApiKey } = require('./config');
const web3 = new Web3('https://mainnet.infura.io/' + infuraApiKey);
const {
  aggregateAllBlocksData,
  calculateRelevantBlockNumbers,
  collectDataOnBlocks,
  convertWeiToEther,
  generateReport,
  filterDuplicateAddresses,
  determineAllContractAddresses,
  validateInput,
} = require('./lib');

module.exports = (numberOfBlocks, getContractAddresses = false) => {
  try {
    validateInput(numberOfBlocks);
  } catch (error) {
    throw new Error(error);
  }
  return calculateRelevantBlockNumbers(numberOfBlocks, web3)
    .then(relevantBlockNumbers => collectDataOnBlocks(relevantBlockNumbers, web3))
    .then(blocksData => aggregateAllBlocksData(blocksData, web3))
    .then(aggregatedBlocksData => convertWeiToEther(aggregatedBlocksData, web3))
    .then(filterDuplicateAddresses)
    .then(filteredAggregatedData => determineAllContractAddresses(getContractAddresses, filteredAggregatedData, web3))
    .then(preparedData => generateReport(numberOfBlocks, preparedData))
    .catch(error => console.log(error));
}
