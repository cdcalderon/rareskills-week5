const formatEtherscanTx = (txHash) => {
  return `https://goerli.etherscan.io/tx/${txHash}`;
};

module.exports = {
  formatEtherscanTx,
};
