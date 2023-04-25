const crypto = require("crypto");
const { ethers } = require("hardhat");
const { BigNumber, Contract, Signer } = ethers;
const { expect } = require("chai");

const formatEtherscanTx = (txHash) => {
  return `https://goerli.etherscan.io/tx/${txHash}`;
};

let accounts;
let eoa;
let contract;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory(
    "GuessTheSecretNumberChallenge"
  );
  contract = factory.attach(`0x92e077E6df89B7019954a5a583D76C642a37739D`);
});

const bruteForceHash = (range, targetHash) => {
  for (let i = 0; i < range; i++) {
    const hash = ethers.utils.keccak256([i]);
    if (targetHash.includes(hash)) {
      console.log(`Found matching hash at index ${i}: ${hash}`);
      return i;
    }
  }
  throw new Error(`No hash found within range ${range}`);
};

it("solves the challenge", async function () {
  const number = bruteForceHash(
    2 ** 8,
    `0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365`
  );
  console.log(`Secret number was ${number}`);
  const tx = await contract.guess(number, {
    value: ethers.utils.parseEther(`1`),
  });
  const txHash = tx && tx.hash;
  console.log(formatEtherscanTx(txHash));

  const isComplete = await contract.isComplete();
  expect(isComplete).to.be.true;
});
