// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Ownable {
    address private _owner;

    constructor() public {
        _owner = msg.sender;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function checkOwner() internal view returns (bool) {
        return msg.sender == _owner;
    }

    modifier onlyOwner() {
        require(checkOwner(), "Insufficient permission");
        _;
    }
}
