// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface ITokenTransfer {
  function beforeTokenTransfer(
    address from,
    address to,
    uint256,
    address token
  ) external;
}
