const _ = require('lodash');

const filterDuplicateAddresses = (aggregatedBlocksData) => {
  const { addressesThatSentEther, addressesThatReceivedEther } = aggregatedBlocksData;
  return Object.assign(
    {},
    aggregatedBlocksData,
    { addressesThatSentEther: _.uniq(addressesThatSentEther) },
    { addressesThatReceivedEther: _.uniq(addressesThatReceivedEther) },
  );
}

module.exports = filterDuplicateAddresses;
