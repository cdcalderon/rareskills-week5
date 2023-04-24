const { expect } = require("chai");

describe("CoinFlip", function () {
  describe("CoinFlip and CoinFlipHack", function () {
    let ICoinFlip, coinFlip, CoinFlipHack, coinFlipHack, owner, attacker;

    beforeEach(async function () {
      [owner, attacker] = await ethers.getSigners();

      // Deploy CoinFlip contract
      const CoinFlip = await ethers.getContractFactory("CoinFlip");
      coinFlip = await CoinFlip.deploy();
      await coinFlip.deployed();

      // Deploy CoinFlipHack contract
      CoinFlipHack = await ethers.getContractFactory("CoinFlipHack");
      coinFlipHack = await CoinFlipHack.deploy(coinFlip.address);
      await coinFlipHack.deployed();
    });

    describe("CoinFlip", function () {
      it("Should start with 0 consecutive wins", async function () {
        expect(await coinFlip.consecutiveWins()).to.equal(0);
      });
    });

    describe("CoinFlipHack", function () {
      it("Should win 10 times in a row", async function () {
        for (let i = 0; i < 10; i++) {
          await coinFlipHack.attack();
          expect(await coinFlip.consecutiveWins()).to.equal(i + 1);
        }
      });
    });
  });

  describe("CoinFlipHack Version 2", () => {
    async function deployCoinFlipFixture() {
      const [deployer, attacker] = await ethers.getSigners();

      // Deploy CoinFlip contract
      const CoinFlip = await ethers.getContractFactory("CoinFlip");
      const coinFlip = await CoinFlip.deploy();
      await coinFlip.deployed();

      // Deploy CoinFlipHack contract
      const CoinFlipHack = await ethers.getContractFactory("CoinFlipHack");
      const coinFlipHack = await CoinFlipHack.deploy(coinFlip.address);
      await coinFlipHack.deployed();

      return { attacker, coinFlip, coinFlipHack };
    }

    it("Should guess the correct outcome 10 times in a row", async () => {
      const { attacker, coinFlip, coinFlipHack } =
        await deployCoinFlipFixture();

      for (let i = 0; i < 10; i++) {
        await coinFlipHack.connect(attacker).attack();
      }

      expect(await coinFlip.consecutiveWins()).to.be.equal(
        "10",
        "Did not win consecutively"
      );
    });
  });
});
