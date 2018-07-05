const expect = require('chai').expect;
const sinon = require('sinon');
const web3Mock = require('./web3Mock');
const {
  aggregateAllBlocksData,
  calculateRelevantBlockNumbers,
  collectDataOnBlocks,
} = require('../lib/index');

describe('aggregateAllBlocksData(blocksData, web3)', () => {
  let mockBlocksData, mockAddressesThatSentEther, mockAddressesThatReceivedEther, expectedAmountOfEther,
    expectedAddressesThatSentEther, expectedAddressesThatReceivedEther;
  beforeEach(() => {
    mockAddressesThatSentEther = [
      '0x70faa28A6B8d6829a4b1E649d26eC9a2a39ba413',
      '0x2C6E2f6C6404237d9270938Aa39c29c0CCFaa1d3',
      '0x76727FD18Fd1E17b0AF32692Ee0f482684Ca63C0',
    ];
    mockAddressesThatReceivedEther = [
      '0x073903b967e40FF9f1190DF3adAd3929A5d3903f',
      '0xFCB956c460b06405fE5378fa1F6ab0E7B21bE448',
      '0xD8e8CaD80FC916Af984BA124f829ba5De78E99b8',
    ]
    mockBlocksData = [
      {
        weiTransferred: '666',
        addressesThatSentEther: mockAddressesThatSentEther,
        addressesThatReceivedEther: mockAddressesThatReceivedEther,
      },
      {
        weiTransferred: '999',
        addressesThatSentEther: mockAddressesThatSentEther,
        addressesThatReceivedEther: mockAddressesThatReceivedEther,
      }
    ]
    expectedAmountOfEther = 20;
    expectedAddressesThatSentEther = mockAddressesThatSentEther.concat(mockAddressesThatSentEther);
    expectedAddressesThatReceivedEther = mockAddressesThatReceivedEther.concat(mockAddressesThatReceivedEther);
  });

  it('takes an array of block data objects and returns a single object', () => {
    expect(typeof aggregateAllBlocksData(mockBlocksData, web3Mock)).to.eql('object');
  });
  it('converts the wei values to ether and sums them', () => {
    expect(aggregateAllBlocksData(mockBlocksData, web3Mock).etherTransferred).to.eql(expectedAmountOfEther);
  });
  it('returns an array of all the addresses that sent ether', () => {
    expect(aggregateAllBlocksData(mockBlocksData, web3Mock).addressesThatSentEther).to.eql(expectedAddressesThatSentEther);
  })
  it('returns an array of all the addresses that received ether', () => {
    expect(aggregateAllBlocksData(mockBlocksData, web3Mock).addressesThatReceivedEther).to.eql(expectedAddressesThatReceivedEther);
  })
});

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

describe('collectDataOnBlocks(blockNumbers, web3)', () => {
  let blockNumbers, expectedAmountOfWeiTransferred, expectedAddressesThatSentEther, expectedAddressesThatReceivedEther;

  beforeEach(() => {
    blockNumbers = [ 12345, 12344 ];
    expectedAmountOfWeiTransferred = 13;
    expectedAddressesThatSentEther = [
      '0xcd2DDEc1150Ded7A28834169683A0DBc93a782c2',
      '0xC5D60DF8f90E5A2989bbF1e21A5350304Fcbe1F2',
    ];
    expectedAddressesThatReceivedEther = [
      '0x9a2d163aB40F88C625Fd475e807Bbc3556566f80',
      '0x7A316433898Ff6eD72478bA946083d0Bd8E340bE',
    ];
  });

  it('returns an array with a block data object for each block', (done) => {
    collectDataOnBlocks(blockNumbers, web3Mock)
      .then(result => {
        expect(result.length).to.eql(2);
        done();
      });
  });

  describe('the objects in the array', () => {
    it('each has a property giving the amount of wei transferred in the block', (done) => {
      collectDataOnBlocks(blockNumbers, web3Mock)
        .then(result => {
          expect(result[0].weiTransferred).to.eql(expectedAmountOfWeiTransferred);
          expect(result[1].weiTransferred).to.eql(expectedAmountOfWeiTransferred);
          done();
        });
    });
    it('contains an array of the addresses that sent ether', (done) => {
      collectDataOnBlocks(blockNumbers, web3Mock)
        .then(result => {
          expect(result[0].addressesThatSentEther).to.eql(expectedAddressesThatSentEther);
          expect(result[1].addressesThatSentEther).to.eql(expectedAddressesThatSentEther);
          done();
        });
    });
    it('contains an array of the addresses that received ether', (done) => {
      collectDataOnBlocks(blockNumbers, web3Mock)
        .then(result => {
          expect(result[0].addressesThatReceivedEther).to.eql(expectedAddressesThatReceivedEther);
          expect(result[1].addressesThatReceivedEther).to.eql(expectedAddressesThatReceivedEther);
          done();
        });
    });
  });
});
