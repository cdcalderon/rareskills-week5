require("@nomicfoundation/hardhat-toolbox");

require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
      },
      {
        version: "0.8.17",
      },
      {
        version: "0.8.15",
      },
      {
        version: "0.8.7",
      },
      {
        version: "0.8.1",
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.6.12",
      },
    ],
  },
};
