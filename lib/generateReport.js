const generateReport = (numberOfBlocks, aggregatedData) => {
  const {
    etherTransferred,
    addressesThatSentEther,
    addressesThatReceivedEther,
    contractAddressesThatSentEther,
    contractAddressesThatReceivedEther,
  } = aggregatedData;
  console.log(`///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////`);
  console.log(`|    In the last ${numberOfBlocks} blocks written to the ethereum blockchain...`);
  console.log(`|    ...there were ${etherTransferred} ether transferred.`);
  console.log(`|    ...there were ${JSON.stringify(addressesThatSentEther.length)} unique addresses that sent ether.`);
  console.log(`|    ...there were ${JSON.stringify(addressesThatReceivedEther.length)} unique addresses that received ether.`);
  if (contractAddressesThatSentEther) {
    console.log(`|    ...there were ${JSON.stringify(contractAddressesThatSentEther.length)} contract addresses that sent ether.`);
    console.log(`|    ...there were ${JSON.stringify(contractAddressesThatReceivedEther.length)} contract addresses that received ether.`);
  }
  console.log(`////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////`);
  return aggregatedData;
}

module.exports = generateReport;
