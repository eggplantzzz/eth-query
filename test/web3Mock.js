module.exports = {
  web3Mock: {
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
      getBlock: (number) => {
        return Promise.resolve({
          transactions: [
            {
              value: 5,
              to: '0x9a2d163aB40F88C625Fd475e807Bbc3556566f80',
              from: '0xcd2DDEc1150Ded7A28834169683A0DBc93a782c2',
            },{
              value: 8,
              to: '0x7A316433898Ff6eD72478bA946083d0Bd8E340bE',
              from: '0xC5D60DF8f90E5A2989bbF1e21A5350304Fcbe1F2',
            }
          ]
        });
      },
      getCode: (address) => {
        if (address === '0x9a2d163aB40F88C625Fd475e807Bbc3556566f80') {
          const byteCode = '0x606060405236156100f8576000357c0100031f578063c2cf7326146103375'
          return Promise.resolve(byteCode);
        } else {
          return Promise.resolve('0x');
        }
      }
    }
  },
  web3MockThatReturnsNullAddresses: {
    eth: {
      getBlockNumber: () => Promise.resolve(12345),
      getBlock: (number) => {
        return Promise.resolve({
          transactions: [
            {
              value: 5,
              to: null,
              from: '0xcd2DDEc1150Ded7A28834169683A0DBc93a782c2',
            },{
              value: 8,
              to: '0x7A316433898Ff6eD72478bA946083d0Bd8E340bE',
              from: null,
            },
            {
              value: 0,
              to: null,
              from: '0xcd2DDEc1150Ded7A2879872123870DBc93a782c2',
            }
          ]
        });
      }
    }
  }
};
