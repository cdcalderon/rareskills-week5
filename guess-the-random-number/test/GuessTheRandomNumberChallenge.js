const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GuessTheRandomNumberChallenge", function () {
  let guessTheRandomNumberChallenge, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const GuessTheRandomNumberChallenge = await ethers.getContractFactory(
      "GuessTheRandomNumberChallenge"
    );
    guessTheRandomNumberChallenge = await GuessTheRandomNumberChallenge.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await guessTheRandomNumberChallenge.deployed();
  });

  async function calculateAnswer(contractInstance) {
    // Get the block number and timestamp from the contract creation transaction
    const transaction = await ethers.provider.getTransaction(
      contractInstance.deployTransaction.hash
    );
    const block = await ethers.provider.getBlock(transaction.blockNumber);

    const answer = await ethers.BigNumber.from(
      ethers.utils.solidityKeccak256(
        ["bytes32", "uint256"],
        [block.parentHash, block.timestamp]
      )
    ).mod(256);

    console.log("calculateAnswer: ", calculateAnswer);
    return answer.toNumber();
  }

  it("should guess the correct number", async function () {
    const correctAnswer = await calculateAnswer(guessTheRandomNumberChallenge);
    await expect(
      guessTheRandomNumberChallenge
        .connect(addr1)
        .guess(correctAnswer, { value: ethers.utils.parseEther("1") })
    ).to.not.be.reverted;
  });

  it("calling isComplete should return true after guessing the correct number", async function () {
    expect(await guessTheRandomNumberChallenge.isComplete()).to.be.false;
    const correctAnswer = await calculateAnswer(guessTheRandomNumberChallenge);
    await guessTheRandomNumberChallenge
      .connect(addr1)
      .guess(correctAnswer, { value: ethers.utils.parseEther("1") });
    expect(await guessTheRandomNumberChallenge.isComplete()).to.be.true;
  });
});
