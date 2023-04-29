The problem with the TokenBankChallenge contract lies in the withdraw() function, which contains a re-entrancy vulnerability. The balance update is done after calling token.transfer(), which allows the attacker to re-enter the function before the balance is updated, thus leading to multiple withdrawals.

The exploit uses a separate TokenBankAttacker contract. When the attacker deposits tokens into the TokenBankChallenge and calls attack(), the flawed withdraw() function is triggered. During the token transfer, the TokenBankChallenge contract calls the TokenBankAttacker's tokenFallback() function.

The exploit works because the attacker calls withdraw() within tokenFallback() before the balance updates. This recursion lets the attacker continuously drain tokens from the TokenBankChallenge contract. The challenge is complete when isComplete() returns true, showing all tokens have been drained.
