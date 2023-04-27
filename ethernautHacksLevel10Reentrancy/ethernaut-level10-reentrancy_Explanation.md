## Ethernaut Level 10 - Re-entrancy Exploit

The Re-entrancy exploit occurs when an external contract is called during a function's execution, allowing it to re-enter the vulnerable contract before the first call is complete.

In Level 10, the `Reentrance` contract's `withdraw()` function sends ether using a low-level call and updates the balance afterwards. This flawed logic allows the attacker's contract to repeatedly call `withdraw()` through its `receive()` function during the same transaction. As a result, the attacker drains the `Reentrance` contract of its funds.

To prevent re-entrancy attacks, implement the "checks-effects-interactions" pattern by updating the state before external calls. Alternatively, use OpenZeppelin's `ReentrancyGuard` for enhanced protection.
