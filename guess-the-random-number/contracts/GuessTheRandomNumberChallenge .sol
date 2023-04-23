// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

// https://goerli.etherscan.io/tx/0x1f3bde8d839912553dcd7c68536a08a5cd863f6cc61fb782204343177768e3c5
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
