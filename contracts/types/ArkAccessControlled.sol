// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.7.5;

import "../interfaces/IArkAuthority.sol";
import "hardhat/console.sol";

abstract contract ArkAccessControlled {

    /* ========== EVENTS ========== */

    event AuthorityUpdated(IArkAuthority indexed authority);

    string UNAUTHORIZED = "UNAUTHORIZED"; // save gas

    /* ========== STATE VARIABLES ========== */

    IArkAuthority public authority;


    /* ========== Constructor ========== */

    constructor(IArkAuthority _authority) {
        authority = _authority;
        emit AuthorityUpdated(_authority);
    }


    /* ========== MODIFIERS ========== */

    modifier onlyGovernor() {
        //update owner only
//        require(msg.sender == authority.governor(), UNAUTHORIZED);
        _;
    }

    modifier onlyGuardian() {
        require(msg.sender == authority.guardian(), UNAUTHORIZED);
        _;
    }

    modifier onlyPolicy() {
        require(msg.sender == authority.policy(), UNAUTHORIZED);
        _;
    }

    modifier onlyVault() {
        require(msg.sender == authority.vault(), UNAUTHORIZED);
        _;
    }

    /* ========== GOV ONLY ========== */

    function setAuthority(IArkAuthority _newAuthority) external onlyGovernor {
        authority = _newAuthority;
        emit AuthorityUpdated(_newAuthority);
    }
}
