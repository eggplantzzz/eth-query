const { filterNullValues } = require('./sharedUtils');
const BigNumber = require('bignumber.js');

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
    .then(blockData => collectSingleBlockTransactionsData(blockData.transactions, web3))
    .then((transactionsData) => {
      const { addressesThatSentEther, addressesThatReceivedEther, weiTransferred, contractsCreated } = transactionsData;
      return {
        weiTransferred,
        contractsCreated,
        addressesThatSentEther: filterNullValues(addressesThatSentEther),
        addressesThatReceivedEther: filterNullValues(addressesThatReceivedEther),
      }
    });
}

const getBlockData = (blockNumber, web3) => web3.eth.getBlock(blockNumber, true);

const collectSingleBlockTransactionsData = (transactions, web3) => {
  const accumulatorInitialValue = {
    weiTransferred: new BigNumber(0),
    contractsCreated: 0,
    addressesThatSentEther: [],
    addressesThatReceivedEther: [],
  }
  return transactions.reduce((accumulator, currentTransaction) => {
    // Perform arithmetic using BigNumber objects to be as precise as possible
    const weiTransferredAsBigNumber = new BigNumber(parseInt(currentTransaction.value));
    accumulator.weiTransferred = accumulator.weiTransferred.plus(weiTransferredAsBigNumber);
    // Receiving contract address is null if it is a contract creation
    if (currentTransaction.to === null) {
      accumulator.contractsCreated++;
    }
    if (parseInt(currentTransaction.value) > 0) {
      accumulator.addressesThatSentEther.push(currentTransaction.from);
      accumulator.addressesThatReceivedEther.push(currentTransaction.to);
    }
    return accumulator;
  }, accumulatorInitialValue);
}

module.exports = collectDataOnBlocks;
