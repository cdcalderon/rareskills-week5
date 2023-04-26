# Exploiting PredictTheFutureChallenge Vulnerability

The vulnerability in `PredictTheFutureChallenge` lies in the predictable answer generation formula. `PredictTheFutureExploit` takes advantage of this by calculating the expected answer off-chain. The exploit locks an initial guess and repeatedly calls the challenge contract's `settle` function when the calculated answer matches the guess. This approach reduces attempts and avoids re-locking the guess, saving ether. The challenge is solved when the contract's balance reaches 0.
