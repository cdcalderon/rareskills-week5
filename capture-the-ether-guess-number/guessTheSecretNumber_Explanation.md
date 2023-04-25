# GuessTheSecretNumber: Summary

## Problem:

The GuessTheSecretNumber contract contains a vulnerability due to its weak hashing mechanism (keccak256) and small search space (uint8). This allows attackers to easily brute-force the secret number and claim the prize.

## Exploitation:

To exploit the vulnerability, an attacker can:

1. Brute-force the secret number by hashing all possible uint8 values and comparing them to answerHash.
2. Call the guess() function with the correct secret number and 1 Ether to claim the 2 Ether prize.

## Takeaways:

1. Use secure hashing mechanisms and larger search spaces to protect sensitive information in smart contracts.
2. Be cautious when storing data on the blockchain, as it is public and can be analyzed by attackers.
3. Perform thorough security audits and testing to ensure the contract's security and proper behavior.
