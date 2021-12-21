// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import './interfaces/IERC20.sol';

contract StakingWarmup {

    address public immutable staking;
    address public immutable sArk;

    constructor ( address _staking, address _sArk ) {
        require( _staking != address(0) );
        staking = _staking;
        require( _sArk != address(0) );
        sArk = _sArk;
    }

    function retrieve( address _staker, uint _amount ) external {
        require( msg.sender == staking );
        IERC20( sArk ).transfer( _staker, _amount );
    }
}
