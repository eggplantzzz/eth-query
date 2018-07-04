const { infuraApiKey } = require('./config');
const expect = require('chai').expect;
const sinon = require('sinon');
const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/' + infuraApiKey);
const { aggregateAllBlocksData } = require('./index');

describe('aggregateAllBlocksData(blocksData)', () => {
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
        weiTransferred: '1234666',
        addressesThatSentEther: mockAddressesThatSentEther,
        addressesThatReceivedEther: mockAddressesThatReceivedEther,
      },
      {
        weiTransferred: '9998888',
        addressesThatSentEther: mockAddressesThatSentEther,
        addressesThatReceivedEther: mockAddressesThatReceivedEther,
      }
    ]
    expectedAmountOfEther =
      parseFloat(web3.utils.fromWei(mockBlocksData[0].weiTransferred.toString(16))) +
      parseFloat(web3.utils.fromWei(mockBlocksData[1].weiTransferred.toString(16)));
    expectedAddressesThatSentEther = mockAddressesThatSentEther.concat(mockAddressesThatSentEther);
    expectedAddressesThatReceivedEther = mockAddressesThatReceivedEther.concat(mockAddressesThatReceivedEther);
  });

  it('takes an array of block data objects and returns a single object', () => {
    expect(typeof aggregateAllBlocksData(mockBlocksData)).to.eql('object');
  });
  it('converts the wei values to ether and sums them', () => {
    expect(aggregateAllBlocksData(mockBlocksData).etherTransferred).to.eql(expectedAmountOfEther);
  });
  it('returns an array of all the addresses that sent ether', () => {
    expect(aggregateAllBlocksData(mockBlocksData).addressesThatSentEther).to.eql(expectedAddressesThatSentEther);
  })
  it('returns an array of all the addresses that received ether', () => {
    expect(aggregateAllBlocksData(mockBlocksData).addressesThatReceivedEther).to.eql(expectedAddressesThatReceivedEther);
  })
});
