const _ = require('lodash');
const Web3 = require('web3');
const config = require('./config');
const { infuraApiKey } = config;
const web3 = new Web3('https://mainnet.infura.io/' + infuraApiKey);

const aggregateAllBlocksData = (blocksData) => {
  const accumulatorInitialValue = {
    etherTransferred: 0,
    addressesThatSentEther: [],
    addressesThatReceivedEther: [],
  }
  return blocksData.reduce((accumulator, currentBlockData) => {
    const etherTransferredInBlock = parseFloat(web3.utils.fromWei(currentBlockData.weiTransferred.toString(16)));
    accumulator.etherTransferred = accumulator.etherTransferred + etherTransferredInBlock;
    accumulator.addressesThatSentEther = accumulator.addressesThatSentEther.concat(currentBlockData.addressesThatSentEther);
    accumulator.addressesThatReceivedEther = accumulator.addressesThatReceivedEther.concat(currentBlockData.addressesThatReceivedEther);
    return accumulator;
  }, accumulatorInitialValue);
}

const calculateRelevantBlockNumbers = (numberOfBlocks) => {
  return getLastBlockNumber()
    .then((lastBlockNumber) => {
      const parsedLastBlockNumber = parseInt(lastBlockNumber);
      let relevantBlockNumbers = [];
      for (let index = 0; index < numberOfBlocks; index++) {
        relevantBlockNumbers.push(lastBlockNumber - index);
      }
      return relevantBlockNumbers;
    });
}

const collectDataOnBlocks = (blockNumbers) => {
  const blocksData = [];
  const arrayLength = blockNumbers.length;
  for (let index = 0; index < arrayLength; index++) {
    blocksData.push(collectDataOnSingleBlock(blockNumbers[index]));
  }
  return Promise.all(blocksData);
}

const collectDataOnSingleBlock = (blockNumber) => {
  return getBlockData(blockNumber)
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
    accumulator.addressesThatSentEther.push(currentTransaction.to);
    accumulator.addressesThatReceivedEther.push(currentTransaction.from);
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
const determineAllContractAddresses = (filteredAggregatedBlocksData) => {
  const { addressesThatSentEther, addressesThatReceivedEther, etherTransferred } = filteredAggregatedBlocksData;
  return Promise.all([
    findContractAddresses(addressesThatSentEther),
    findContractAddresses(addressesThatReceivedEther),
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

const findContractAddresses = (addresses) => {
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

const getBlockData = (blockNumber) => web3.eth.getBlock(blockNumber, true);

const getLastBlockNumber = () => web3.eth.getBlockNumber();

module.exports = {
  aggregateAllBlocksData,
  calculateRelevantBlockNumbers,
  collectDataOnBlocks,
  createReport,
  filterDuplicateAddresses,
  determineAllContractAddresses,
}
