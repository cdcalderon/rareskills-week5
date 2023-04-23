The GuessTheRandomNumberChallenge contract is a simple guessing game where the goal is to guess a random number between 0 and 255. https://capturetheether.com/challenges/lotteries/guess-the-random-number/
The contract works as follows:

- When the contract is deployed, it requires 1 ether to be sent as the initial contract balance.
- It calculates the random number (answer) using the hash of the previous block and the current timestamp (now). The random number is stored as a state variable, which is publicly accessible on the blockchain.
- Users can make a guess by calling the guess function and sending 1 ether along with their guess. If the user's guess matches the answer, the contract transfers 2 ether to the user.

There are two primary ways to exploit the GuessTheRandomNumberChallenge contract:

1. Attack contract: By creating a separate smart contract, called an "attack" contract, you can interact with the GuessTheRandomNumberChallenge contract, read the state variable (answer), and then call the guess function with the correct number. This exploit leverages the fact that the answer is publicly available on the blockchain.

2. Transaction analysis on Etherscan: You can analyze the transaction that deployed the GuessTheRandomNumberChallenge contract on Etherscan (or any other block explorer). By examining the block's parent hash and timestamp, you can recreate the same calculation used to generate the answer in the original contract. With the correct answer, you can call the guess function and win the game. This exploit leverages the deterministic nature of the random number generation based on blockchain data.
