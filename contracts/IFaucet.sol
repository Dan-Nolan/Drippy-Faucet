// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IFaucet {
  function deposit(uint256 amount) external;
  function claim(address user) external returns (uint256);
}
