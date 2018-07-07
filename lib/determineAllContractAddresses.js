const { filterNullValues } = require('./sharedUtils');

const determineAllContractAddresses = (getContractAddresses, filteredAggregatedBlocksData, web3) => {
  if (!getContractAddresses) return filteredAggregatedBlocksData;
  const { addressesThatSentEther, addressesThatReceivedEther, etherTransferred } = filteredAggregatedBlocksData;
  return Promise.all([
    findContractAddresses(addressesThatSentEther, web3),
    findContractAddresses(addressesThatReceivedEther, web3),
  ])
  .then(contractAddresses => {
    const filteredContractAddressesThatSentEther = filterNullValues(contractAddresses[0]);
    const filteredContractAddressesThatReceivedEther = filterNullValues(contractAddresses[1]);
    return {
      etherTransferred,
      addressesThatSentEther,
      addressesThatReceivedEther,
      contractAddressesThatSentEther: filteredContractAddressesThatSentEther,
      contractAddressesThatReceivedEther: filteredContractAddressesThatReceivedEther,
    }
  });
}

const findContractAddresses = (addresses, web3) => {
  const contractAddresses = [];
  for (let index = 0; index < addresses.length; index++) {
    contractAddresses.push(
      // If an address is a contract address it returns bytecode, otherwise it returns '0x'
      web3.eth.getCode(addresses[index])
        .then(code => {
          if (code !== '0x') {
            return addresses[index];
          } else {
            return null;
          }
        })
      );
  }
  return Promise.all(contractAddresses);
}

module.exports = determineAllContractAddresses;
