const { expect } = require("chai");
const { ethers } = require("hardhat");

const { utils } = ethers;

describe("GuessTheNewNumberChallenge", () => {
  it("Solves challenge", async () => {
    const challengeFactory = await ethers.getContractFactory(
      "GuessTheNewNumberChallenge"
    );
    const challengeContract = await challengeFactory.deploy({
      value: utils.parseEther("1"),
    });
    await challengeContract.deployed();

    const attackFactory = await ethers.getContractFactory(
      "GuessTheNewNumberExploit"
    );
    const attackContract = await attackFactory.deploy(
      challengeContract.address
    );
    await attackContract.deployed();

    const tx = await attackContract.exploit({ value: utils.parseEther("1") });
    await tx.wait();

    expect(await challengeContract.isComplete()).to.be.true;
  });
});
