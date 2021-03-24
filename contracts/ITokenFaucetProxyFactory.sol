// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

/// @title Stake Prize Pool Proxy Factory
/// @notice Minimal proxy pattern for creating new TokenFaucet contracts
interface ITokenFaucetProxyFactory {
  /// @notice Creates a new TokenFaucet
  /// @param _asset The asset to disburse to users
  /// @param _measure The token to use to measure a users portion
  /// @param _dripRatePerSecond The amount of the asset to drip each second
  /// @return A reference to the new proxied TokenFaucet
  function create(
    address _asset,
    address _measure,
    uint256 _dripRatePerSecond
  ) external returns (address);
}
