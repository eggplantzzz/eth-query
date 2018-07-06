const aggregateAllBlocksData = (blocksData, web3) => {
  const accumulatorInitialValue = {
    etherTransferred: 0,
    addressesThatSentEther: [],
    addressesThatReceivedEther: [],
  }
  return blocksData.reduce((accumulator, currentBlockData) => {
    const etherTransferredInBlock = parseFloat(web3.utils.fromWei(currentBlockData.weiTransferred.toString()));
    accumulator.etherTransferred = accumulator.etherTransferred + etherTransferredInBlock;
    accumulator.addressesThatSentEther = accumulator.addressesThatSentEther.concat(currentBlockData.addressesThatSentEther);
    accumulator.addressesThatReceivedEther = accumulator.addressesThatReceivedEther.concat(currentBlockData.addressesThatReceivedEther);
    return accumulator;
  }, accumulatorInitialValue);
}

module.exports = aggregateAllBlocksData;
