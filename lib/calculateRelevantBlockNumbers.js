const getLastBlockNumber = (web3) => web3.eth.getBlockNumber();

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

module.exports = calculateRelevantBlockNumbers;
