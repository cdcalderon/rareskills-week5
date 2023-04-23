// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

// https://goerli.etherscan.io/tx/0x1f3bde8d839912553dcd7c68536a08a5cd863f6cc61fb782204343177768e3c5
// https://goerli.etherscan.io/tx/0x1f3bde8d839912553dcd7c68536a08a5cd863f6cc61fb782204343177768e3c5#statechange
// https://goerli.etherscan.io/tx/0x87b18a9da31ec8753c81f4d7c15e62c1592b98576b2c77987ca55560d0fff91c
// https://goerli.etherscan.io/block/8879622
// https://goerli.etherscan.io/block/8879621
contract GuessTheRandomNumberChallenge {
    uint8 answer;

    function GuessTheRandomNumberChallenge() public payable {
        require(msg.value == 1 ether);
        answer = uint8(keccak256(block.blockhash(block.number - 1), now));
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
