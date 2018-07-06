const expect = require('chai').expect;
const { web3Mock } = require('./web3Mock');
const { determineAllContractAddresses } = require('../lib');

describe('determineAllContractAddresses(filteredAggregatedBlocksData, web3)', () => {
  let filteredAggregatedBlocksData;
  beforeEach(() => {
    filteredAggregatedBlocksData = {
      etherTransferred: 1,
      addressesThatSentEther: [
        '0xcd2DDEc1150Ded7A28834169683A0DBc93a782c2',
        '0xC5D60DF8f90E5A2989bbF1e21A5350304Fcbe1F2',
      ],
      addressesThatReceivedEther: [
        '0x9a2d163aB40F88C625Fd475e807Bbc3556566f80',
        '0x7A316433898Ff6eD72478bA946083d0Bd8E340bE',
      ]
    }
  });

  it('resolves a promise with an object', (done) => {
    determineAllContractAddresses(filteredAggregatedBlocksData, web3Mock)
      .then(result => {
        expect(typeof result).to.eql('object');
        done();
      });
  });

  describe('the array containing the contract addresses that sent ether', () => {
    let expectedContractAddressesThatSentEther, expectedContractAddressesThatReceivedEther;
    beforeEach(() => {
      expectedContractAddressesThatSentEther = [];
    });
    it('contains the contract addresses that sent ether', (done) => {
      determineAllContractAddresses(filteredAggregatedBlocksData, web3Mock)
        .then(result => {
          expect(result.contractAddressesThatSentEther).to.eql(expectedContractAddressesThatSentEther);
          done();
        });
    });
  });

  describe('the array containing the contract addresses that received ether', () => {
    beforeEach(() => {
      expectedContractAddressesThatReceivedEther = [ '0x9a2d163aB40F88C625Fd475e807Bbc3556566f80' ];
    });
    it('contains the contract addresses that received ether', (done) => {
      determineAllContractAddresses(filteredAggregatedBlocksData, web3Mock)
        .then(result => {
          expect(result.contractAddressesThatReceivedEther).to.eql(expectedContractAddressesThatReceivedEther);
          done();
        });
    });
  });
});
