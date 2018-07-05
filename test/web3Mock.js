module.exports = {
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
    }
  }
};
