const generateReport = (numberOfBlocks, aggregatedData) => {
  const {
    weiTransferred,
    etherTransferred,
    contractsCreated,
    addressesThatSentEther,
    addressesThatReceivedEther,
    contractAddressesThatSentEther,
    contractAddressesThatReceivedEther,
  } = aggregatedData;
  console.log(`//////////////////////////////////////////////////////////////////////////////`);
  console.log(`|    In the last ${numberOfBlocks} blocks written to the ethereum blockchain...`);
  console.log(`|    ...there were ${etherTransferred} ether transferred.`);
  console.log(`|    ...there were ${addressesThatSentEther.length} unique addresses that sent ether.`);
  console.log(`|    ...there were ${addressesThatReceivedEther.length} unique addresses that received ether.`);
  if (contractAddressesThatSentEther) {
    console.log(`|    ...there were ${contractAddressesThatSentEther.length} contract addresses that sent ether.`);
    console.log(`|    ...there were ${contractAddressesThatReceivedEther.length} contract addresses that received ether.`);
  }
  console.log(`|    ...there were ${contractsCreated} contracts created.`);
  console.log(`///////////////////////////////////////////////////////////////////////////////`);
  return aggregatedData;
}

module.exports = generateReport;
