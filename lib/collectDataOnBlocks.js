const { filterNullValues } = require('./sharedUtils');

const collectDataOnBlocks = (blockNumbers, web3) => {
  const blocksData = [];
  const arrayLength = blockNumbers.length;
  for (let index = 0; index < arrayLength; index++) {
    blocksData.push(collectDataOnSingleBlock(blockNumbers[index], web3));
  }
  return Promise.all(blocksData);
}

const collectDataOnSingleBlock = (blockNumber, web3) => {
  return getBlockData(blockNumber, web3)
    .then(blockData => collectSingleBlockTransactionsData(blockData.transactions))
    .then(transactionsData => {
      const { addressesThatSentEther, addressesThatReceivedEther, weiTransferred } = transactionsData;
      return {
        weiTransferred,
        addressesThatSentEther: filterNullValues(addressesThatSentEther),
        addressesThatReceivedEther: filterNullValues(addressesThatReceivedEther),
      }
    });
}

const getBlockData = (blockNumber, web3) => web3.eth.getBlock(blockNumber, true);

const collectSingleBlockTransactionsData = (transactions) => {
  const accumulatorInitialValue = {
    weiTransferred: 0,
    addressesThatSentEther: [],
    addressesThatReceivedEther: [],
  }
  return transactions.reduce((accumulator, currentTransaction) => {
    accumulator.weiTransferred = accumulator.weiTransferred + parseInt(currentTransaction.value);
    accumulator.addressesThatSentEther.push(currentTransaction.from);
    accumulator.addressesThatReceivedEther.push(currentTransaction.to);
    return accumulator;
  }, accumulatorInitialValue);
}

module.exports = collectDataOnBlocks;
