const { convertWeiToEther } = require('../lib');
const expect = require('chai').expect;
const BigNumber = require('bignumber.js');

describe('convertWeiToEther(aggregatedBlocksData, web3)', () => {
  let aggregatedBlocksData, web3Mock, weiTransferredAsHex;
  beforeEach(() => {
    aggregatedBlocksData = {
      weiTransferred: new BigNumber(123456789)
    }
    weiTransferredAsHex = aggregatedBlocksData.weiTransferred.toString(16);
    web3Mock = {
      utils: {
        fromWei: (wei) => {
          if (wei === weiTransferredAsHex) return 0.000000000123456789;
        }
      }
    }
  });

  it('converts the weiTransferred into ether and adds it to the data object', () => {
    expect(convertWeiToEther(aggregatedBlocksData, web3Mock).etherTransferred).to.eql(0.000000000123456789);
  });
});
