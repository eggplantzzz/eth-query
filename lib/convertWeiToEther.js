const convertWeiToEther = (aggregatedBlocksData, web3) => {
  const { weiTransferred } = aggregatedBlocksData;
  const weiTransferredAsHex = weiTransferred.toString(16);
  const etherTransferred = web3.utils.fromWei(weiTransferredAsHex, 'ether');
  return Object.assign(
    {},
    aggregatedBlocksData,
    { weiTransferred: weiTransferred.toString() },
    { etherTransferred }
  );
}

module.exports = convertWeiToEther;
