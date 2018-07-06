const expect = require('chai').expect;
const { filterDuplicateAddresses } = require('../lib');

describe('filterDuplicateAddresses(aggregatedBlocksData)', () => {
  let aggregatedBlocksData, expectedResult;
  beforeEach(() => {
    aggregatedBlocksData = {
      etherTransferred: 3,
      addressesThatSentEther: [
        '0x9a2d163aB40F88C625Fd475e807Bbc3556566f80',
        '0x9a2d163aB40F88C625Fd475e807Bbc3556566f80',
        '0x9a2d163aB40F88C625Fd475e807Bbc3556566f80',
        '0x9a2d163aB40F88C625Fd475e807Bbc3556566f80',
        '0xcd2DDEc1150Ded7A28834169683A0DBc93a782c2',
      ],
      addressesThatReceivedEther: [
        '0x7A316433898Ff6eD72478bA946083d0Bd8E340bE',
        '0x7A316433898Ff6eD72478bA946083d0Bd8E340bE',
        '0xC5D60DF8f90E5A2989bbF1e21A5350304Fcbe1F2',
      ]
    }
    expectedResult = {
      etherTransferred: 3,
      addressesThatSentEther: [
        '0x9a2d163aB40F88C625Fd475e807Bbc3556566f80',
        '0xcd2DDEc1150Ded7A28834169683A0DBc93a782c2',
      ],
      addressesThatReceivedEther: [
        '0x7A316433898Ff6eD72478bA946083d0Bd8E340bE',
        '0xC5D60DF8f90E5A2989bbF1e21A5350304Fcbe1F2',
      ]
    }
  });

  it('returns an object with the amount of ether transferred', () => {
    expect(filterDuplicateAddresses(aggregatedBlocksData).etherTransferred).to.eql(expectedResult.etherTransferred);
  });
  it('de-duplicates the addresses in the addresses that sent ether array', () => {
    expect(filterDuplicateAddresses(aggregatedBlocksData).addressesThatSentEther).to.eql(expectedResult.addressesThatSentEther);
  });
  it('de-duplicates the addresses in the addresses that received ether array', () => {
    expect(filterDuplicateAddresses(aggregatedBlocksData).addressesThatReceivedEther).to.eql(expectedResult.addressesThatReceivedEther);
  });
});
