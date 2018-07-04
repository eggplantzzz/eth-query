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
  calculateRelevantBlockNumbers(numberOfBlocks)
    .then(collectDataOnBlocks)
    .then(aggregateAllBlocksData)
    .then(filterDuplicateAddresses)
    .then(determineAllContractAddresses)
    .then(filteredAggregatedData => createReport(numberOfBlocks, filteredAggregatedData))
    .catch(error => console.log(error));
}

module.exports = etherReportFromLastWrittenBlocks;
