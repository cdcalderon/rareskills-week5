const { expect } = require("chai");

describe("TokenBankChallenge", function () {
  let TokenBankChallenge, AttackTokenBank;
  let tokenBank, attackTokenBank;
  let deployer, player, attacker;

  beforeEach(async function () {
    [deployer, player, attacker] = await ethers.getSigners();

    TokenBankChallenge = await ethers.getContractFactory("TokenBankChallenge");
    tokenBank = await TokenBankChallenge.deploy(attacker.address);

    const SimpleERC223Token = await ethers.getContractFactory(
      "SimpleERC223Token"
    );
    const tokenAddress = await tokenBank.token();
    token = await SimpleERC223Token.attach(tokenAddress);

    AttackTokenBank = await ethers.getContractFactory("AttackTokenBank");
    attackTokenBank = await AttackTokenBank.deploy(tokenBank.address);

    tokenBank.on("InsufficientBalance", (requested, available) => {
      console.log(
        `Insufficient balance. Requested: ${requested.toString()}, Available: ${available.toString()}`
      );
    });
  });

  it("TokenBankChallenge should be deployed correctly", async function () {
    expect(await tokenBank.isComplete()).to.be.false;
    expect(await tokenBank.token()).to.not.be.null;
  });

  it("AttackTokenBank should be deployed correctly", async function () {
    expect(await attackTokenBank.tokenBankChallenge()).to.not.be.empty;
    expect(await attackTokenBank.token()).to.not.be.empty;
    expect(await attackTokenBank.attacker()).to.not.be.empty;
  });

  it("should exploit the TokenBankChallenge contract using the AttackTokenBank contract", async () => {
    // Check initial attacker's balance in the TokenBankChallenge contract
    const initialAttackerBalance = await tokenBank.balanceOf(attacker.address);
    console.log("Initial attacker balance:", initialAttackerBalance.toString());
    expect(initialAttackerBalance).to.not.equal(0);

    // Check initial tokenBank's token balance
    const initialTokenBankBalance = await token.balanceOf(tokenBank.address);
    console.log(
      "Initial tokenBank balance:",
      initialTokenBankBalance.toString()
    );

    // Connect the AttackTokenBank contract with the attacker's signer
    const attackTokenBankAsAttacker = attackTokenBank.connect(attacker);

    // Perform the attack
    await attackTokenBankAsAttacker.attack();
    console.log("Attack performed");

    // Check the final attacker's token balance
    const finalAttackerBalance = await token.balanceOf(attacker.address);
    console.log("Final attacker balance:", finalAttackerBalance.toString());

    // Check the TokenBankChallenge contract's token balance
    const tokenBankBalance = await token.balanceOf(tokenBank.address);
    console.log("TokenBankChallenge balance:", tokenBankBalance.toString());

    // The attacker should have more tokens than their initial balance
    expect(finalAttackerBalance).to.be.gt(initialAttackerBalance);

    // The TokenBankChallenge contract should have no tokens left
    expect(tokenBankBalance).to.equal(0);

    // The challenge should be marked as complete
    expect(await tokenBank.isComplete()).to.equal(true);
  });
});
