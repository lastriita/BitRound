require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');

const mnemonic = 'sweet until cloth warrior tired gas manage narrow sauce jewel toss sweet';

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://goerli.infura.io/v3/6e60fbbfba9346db89e37bdd1cf28916',
      accounts: {
        mnemonic: mnemonic,
      },
    },
  },
};
//https://sepolia.infura.io/v3/e57793b4fdd6406e8dd386ebf0c8f60d