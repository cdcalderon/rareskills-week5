const { expect } = require("chai");

describe("Shop and ShopAttack", function () {
  let Shop, shop, ShopAttack, shopAttack, accounts;

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    Shop = await ethers.getContractFactory("Shop");
    shop = await Shop.deploy();
    await shop.deployed();

    ShopAttack = await ethers.getContractFactory("ShopAttack");
    shopAttack = await ShopAttack.deploy(shop.address);
    await shopAttack.deployed();
  });

  it("ShopAttack should exploit Shop contract", async function () {
    // Check the initial state of the Shop contract
    expect(await shop.price()).to.equal(100);
    expect(await shop.isSold()).to.equal(false);

    // Perform the attack
    await shopAttack.attack();

    // Check if the Shop contract was exploited
    expect(await shop.price()).to.equal(99);
    expect(await shop.isSold()).to.equal(true);
  });
});
