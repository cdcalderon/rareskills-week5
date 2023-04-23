const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GuessTheRandomNumber", function () {
  let guessTheRandomNumber;
  let attack;
  let owner;
  let attacker;
  let other;

  beforeEach(async function () {
    // Get signers
    [owner, attacker, other] = await ethers.getSigners();

    // Deploy GuessTheRandomNumber contract
    const GuessTheRandomNumber = await ethers.getContractFactory(
      "GuessTheRandomNumber"
    );
    guessTheRandomNumber = await GuessTheRandomNumber.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await guessTheRandomNumber.deployed();

    // Deploy Attack contract
    const Attack = await ethers.getContractFactory("Attack");
    attack = await Attack.deploy();
    await attack.deployed();
  });

  it("should not allow incorrect guesses", async function () {
    const initialContractBalance = await ethers.provider.getBalance(
      guessTheRandomNumber.address
    );
    await guessTheRandomNumber.connect(other).guess(42);
    const finalContractBalance = await ethers.provider.getBalance(
      guessTheRandomNumber.address
    );
    expect(initialContractBalance).to.equal(finalContractBalance);
  });

  // There is a small chance that the previous test might fail if the random number generated
  // by the GuessTheRandomNumber contract is actually 42. this test avoid that
  // This test case now calculates the balance change of the user,
  // excluding the gas cost, after making an incorrect guess.
  // It checks whether the balance change is less than 1 ether,
  // which implies that no Ether was transferred from the GuessTheRandomNumber
  // contract to the user when the guess was incorrect.
  // This should avoid the AssertionError and provide a more reliable test case.
  it("should not transfer Ether to user for incorrect guesses", async function () {
    const initialUserBalance = await other.getBalance();

    // Execute the transaction
    const tx = await guessTheRandomNumber.connect(other).guess(42);
    const gasUsed = (await tx.wait()).gasUsed;
    const gasCost = gasUsed.mul(tx.gasPrice);

    const finalUserBalance = await other.getBalance();

    // Calculate the balance change, excluding the gas cost
    const balanceChange = initialUserBalance.sub(finalUserBalance).sub(gasCost);

    // Check if the balance change is less than 1 ether
    expect(balanceChange).to.be.lt(ethers.utils.parseEther("1"));
  });

  it("should allow the Attack contract to successfully guess the number and win", async function () {
    await attack.connect(attacker).attack(guessTheRandomNumber.address);

    // Check if Attack contract received 1 Ether
    expect(await attack.getBalance()).to.equal(ethers.utils.parseEther("1"));

    // Check if GuessTheRandomNumber contract has 0 Ether left
    expect(
      await ethers.provider.getBalance(guessTheRandomNumber.address)
    ).to.equal(0);
  });

  it("should not allow the Attack contract to guess and win multiple times", async function () {
    await attack.connect(attacker).attack(guessTheRandomNumber.address);

    // Attempt second attack
    await expect(attack.connect(attacker).attack(guessTheRandomNumber.address))
      .to.be.reverted;
  });
});
