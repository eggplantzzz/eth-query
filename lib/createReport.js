const createReport = (numberOfBlocks, aggregatedData, returnJson) => {
  if (returnJson) {
    return aggregatedData;
  } else {
    return createConsoleReport(numberOfBlocks, aggregatedData);
  }
}

const createConsoleReport = (numberOfBlocks, aggregatedData) => {
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
  console.log(`|    ...there were ${JSON.stringify(contractAddressesThatSentEther.length)} contract addresses that received ether.`);
  console.log(`|    ...there were ${JSON.stringify(contractAddressesThatReceivedEther.length)} contract addresses that received ether.`);
  console.log(`////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////`);
}

module.exports = createReport;
