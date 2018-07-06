const _ = require('lodash');

const filterDuplicateAddresses = (aggregatedBlocksData) => {
  const { etherTransferred, addressesThatSentEther, addressesThatReceivedEther } = aggregatedBlocksData;
  return {
    etherTransferred: etherTransferred,
    addressesThatSentEther: _.uniq(addressesThatSentEther),
    addressesThatReceivedEther: _.uniq(addressesThatReceivedEther),
  }
}

module.exports = filterDuplicateAddresses;
