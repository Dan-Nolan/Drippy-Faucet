// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ITokenTransfer.sol";

contract Stake is ERC20 {
    address faucet;

    constructor(uint256 initialSupply, address _faucet) ERC20("Stake", "STK") {
        faucet = _faucet;
        _mint(msg.sender, initialSupply);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        ITokenTransfer(faucet).beforeTokenTransfer(from, to, amount, address(this));
    }
}
