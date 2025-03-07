// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleMyToken is ERC20, Ownable{

    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; //1 million tokens with 18 decimals

    constructor(string memory name, string memory symbol) ERC20(name , symbol) Ownable(msg.sender)
    {
        _mint(msg.sender , INITIAL_SUPPLY);
    }

    function mint(address to, uint256 amount) public onlyOwner{
        _mint(to, amount);
    }

     function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

}