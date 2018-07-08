const BigNumber = require('bignumber.js');

const aggregateAllBlocksData = (blocksData, web3) => {
  const accumulatorInitialValue = {
    weiTransferred: new BigNumber(0),
    contractsCreated: 0,
    addressesThatSentEther: [],
    addressesThatReceivedEther: [],
  }
  return blocksData.reduce((accumulator, currentBlockData) => {
    accumulator.weiTransferred = accumulator.weiTransferred.plus(currentBlockData.weiTransferred);
    accumulator.contractsCreated = accumulator.contractsCreated + currentBlockData.contractsCreated;
    accumulator.addressesThatSentEther = accumulator.addressesThatSentEther.concat(currentBlockData.addressesThatSentEther);
    accumulator.addressesThatReceivedEther = accumulator.addressesThatReceivedEther.concat(currentBlockData.addressesThatReceivedEther);
    return accumulator;
  }, accumulatorInitialValue);
}

module.exports = aggregateAllBlocksData;
