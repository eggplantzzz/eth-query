const _ = require('lodash');

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

const calculateRelevantBlockNumbers = (numberOfBlocks, web3) => {
  return getLastBlockNumber(web3)
    .then((lastBlockNumber) => {
      const parsedLastBlockNumber = parseInt(lastBlockNumber);
      let relevantBlockNumbers = [];
      for (let index = 0; index < numberOfBlocks; index++) {
        relevantBlockNumbers.push(lastBlockNumber - index);
      }
      return relevantBlockNumbers;
    });
}

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
const determineAllContractAddresses = (filteredAggregatedBlocksData, web3) => {
  const { addressesThatSentEther, addressesThatReceivedEther, etherTransferred } = filteredAggregatedBlocksData;
  return Promise.all([
    findContractAddresses(addressesThatSentEther, web3),
    findContractAddresses(addressesThatReceivedEther, web3),
  ])
  .then(contractAddresses => {
    console.log('The contract addresses ----> ' + JSON.stringify(contractAddresses));
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

const filterNullValues = (array) => {
  return _.filter(array, (item) => item !== null);
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

const filterDuplicateAddresses = (aggregatedBlocksData) => {
  const { etherTransferred, addressesThatSentEther, addressesThatReceivedEther } = aggregatedBlocksData;
  return {
    etherTransferred: etherTransferred,
    addressesThatSentEther: _.uniq(addressesThatSentEther),
    addressesThatReceivedEther: _.uniq(addressesThatReceivedEther),
  }
}

const getBlockData = (blockNumber, web3) => web3.eth.getBlock(blockNumber, true);

const getLastBlockNumber = (web3) => web3.eth.getBlockNumber();

module.exports = {
  aggregateAllBlocksData,
  calculateRelevantBlockNumbers,
  collectDataOnBlocks,
  createReport,
  determineAllContractAddresses,
  filterDuplicateAddresses,
  getLastBlockNumber,
}
