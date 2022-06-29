// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./IERC20.sol";
import "./IERC20Metadata.sol";

contract ERC20 is IERC20, IERC20Metadata {

    mapping(address => uint256) private _balances;
    // How much I have given to users to spend on my behalf
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function name() public view override returns (string memory){
        return _name;
    }

    function symbol() public view override returns (string memory){
        return _symbol;
    }

    function decimals() public view override returns (uint8){
        return 18;
    }

    function totalSupply() public view override returns (uint256){
        return _totalSupply;
    }

    function balanceOf(address _owner) public view override returns (uint256 balance){
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public override returns (bool success){
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }

    function allowance(address _owner, address _spender) public view override returns (uint256 remaining){
        return _allowances[_owner][_spender];
    }

    function approve(address _spender, uint256 _value) public override returns (bool success){
        address owner = msg.sender;
        _approve(owner, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success){
        address spender = msg.sender;
        _spendAllowance(_from, spender, _value);
        _transfer(_from, _to, _value);
        return true;
    }

}
