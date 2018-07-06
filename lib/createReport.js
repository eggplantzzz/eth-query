const createReport = (numberOfBlocks, aggregatedData) => {
  const {
    etherTransferred,
    addressesThatSentEther,
    addressesThatReceivedEther,
    contractAddressesThatSentEther,
    contractAddressesThatReceivedEther,
  } = aggregatedData;
  console.log(`/////////////////////////////////////////////////////////////////////////////`);
  console.log(`|    There was ${etherTransferred} ether transferred in the last ${numberOfBlocks} blocks.               |`);
  console.log(`|    There were ${JSON.stringify(addressesThatSentEther.length)} unique addresses that sent ether. |`);
  console.log(`|    There were ${JSON.stringify(addressesThatReceivedEther.length)} unique addresses that received ether. |`);
  console.log(`|    The contract addresses that sent ether were ${JSON.stringify(contractAddressesThatSentEther)} |`);
  console.log(`|    The contract addresses that received ether were ${JSON.stringify(contractAddressesThatReceivedEther)} |`);
  console.log(`/////////////////////////////////////////////////////////////////////////////`);
}

module.exports = createReport;
