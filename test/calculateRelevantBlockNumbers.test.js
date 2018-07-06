const { calculateRelevantBlockNumbers } = require('../lib');
const { web3Mock } = require('./web3Mock');
const expect = require('chai').expect;

describe('calculateRelevantBlockNumbers(numberOfBlocks, web3)', () => {
  let expectedResult, numberOfBlocks, lastBlockNumber;
  beforeEach(() => {
    numberOfBlocks = 5;
    expectedResult = [ 12345, 12344, 12343, 12342, 12341 ];
  });
  it('given a number n of blocks it calculates the last n block numbers starting with the most recently written one', (done) => {
    calculateRelevantBlockNumbers(numberOfBlocks, web3Mock)
      .then(result => {
        expect(result).to.eql(expectedResult);
        done();
      });
  })
});
