const expect = require('chai').expect;
const sinon = require('sinon');
const web3Mock = {
  utils: {
    fromWei: (weiTransferred) => {
      if (weiTransferred === '666' || weiTransferred === '999') {
        return 10;
      } else {
        return null;
      }
    },
  },
  eth: {
    getBlockNumber: () => Promise.resolve(12345),
  }
};
const {
  aggregateAllBlocksData,
  calculateRelevantBlockNumbers,
} = require('./index');

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
