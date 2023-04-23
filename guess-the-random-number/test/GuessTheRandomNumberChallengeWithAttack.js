const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Attack", function () {
  let guessTheRandomNumberChallenge, attack, owner, addr1;
  const initialBalance = ethers.utils.parseEther("1");

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const GuessTheRandomNumberChallenge = await ethers.getContractFactory(
      "GuessTheRandomNumberChallenge"
    );
    guessTheRandomNumberChallenge = await GuessTheRandomNumberChallenge.deploy({
      value: initialBalance,
    });
    await guessTheRandomNumberChallenge.deployed();

    const Attack = await ethers.getContractFactory("Attack");
    attack = await Attack.deploy(guessTheRandomNumberChallenge.address);
    await attack.deployed();
  });

  it("should guess the correct number using the Attack contract", async function () {
    const attackBalanceBefore = await ethers.provider.getBalance(
      attack.address
    );
    expect(attackBalanceBefore).to.equal(0);

    // Connect addr1 as the signer for the attack contract
    const attackWithSigner = attack.connect(addr1);
    try {
      await attackWithSigner.attack({ value: ethers.utils.parseEther("1") });
    } catch (error) {
      console.error("Error while calling the attack function:", error.message);
    }

    const attackBalanceAfter = await ethers.provider.getBalance(attack.address);
    expect(attackBalanceAfter).to.equal(ethers.utils.parseEther("2"));
  });

  it("calling isComplete should return true after guessing the correct number using the Attack contract", async function () {
    const attackWithSigner = attack.connect(addr1);
    try {
      await attackWithSigner.attack({ value: ethers.utils.parseEther("1") });
    } catch (error) {
      console.error("Error while calling the attack function:", error.message);
    }

    const isComplete = await guessTheRandomNumberChallenge.isComplete();
    expect(isComplete).to.equal(true);
  });
});
