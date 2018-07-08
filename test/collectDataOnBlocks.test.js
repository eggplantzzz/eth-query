const expect = require('chai').expect;
const BigNumber = require('bignumber.js');
const { collectDataOnBlocks } = require('../lib');
const { web3Mock, web3MockThatReturnsNullAddresses } = require('./web3Mock');

describe('collectDataOnBlocks(blockNumbers, web3)', () => {
  let blockNumbers, expectedAmountOfWeiTransferred, expectedAddressesThatSentEther, expectedAddressesThatReceivedEther;

  beforeEach(() => {
    blockNumbers = [ 12345, 12344 ];
    expectedAmountOfWeiTransferred = new BigNumber(13);
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

  describe('when there are null values in the addresses array', () => {
    beforeEach(() => {
      expectedAddressesThatSentEther = [
        '0xcd2DDEc1150Ded7A28834169683A0DBc93a782c2',
        '0xcd2DDEc1150Ded7A2879872123870DBc93a782c2',
       ];
      expectedAddressesThatReceivedEther = [ '0x7A316433898Ff6eD72478bA946083d0Bd8E340bE' ];
    });

    it('filters out the null addresses', (done) => {
      collectDataOnBlocks(blockNumbers, web3MockThatReturnsNullAddresses)
        .then(result => {
          expect(result[0].addressesThatReceivedEther).to.eql(expectedAddressesThatReceivedEther);
          expect(result[1].addressesThatReceivedEther).to.eql(expectedAddressesThatReceivedEther);
          done();
        });
    });
    it('counts a contract creation for each null receiving address', (done) => {
      collectDataOnBlocks(blockNumbers, web3MockThatReturnsNullAddresses)
        .then(result => {
          expect(result[0].contractsCreated).to.eql(2);
          expect(result[1].contractsCreated).to.eql(2);
          done();
        });
    });
  });
});
