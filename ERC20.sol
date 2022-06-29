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
        _transfer(owner, _to, _value);
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

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: Do not transfer from the zero address.");
        require(from != address(0), "ERC20: Do not transfer to the zero address.");

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: Transfer amount exceeds balance.");

        // Save in gas fees
    unchecked {
        _balances[from] = fromBalance - amount;
    }

        _balances[to] += amount;

        emit Transfer(from, to, amount);

    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: Do not approve from the zero address.");
        require(spender != address(0), "ERC20: Do not approve to the zero address.");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);

    }

    function _spendAllowance(address owner, address spender, uint256 amount)internal {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance < type(uint256).max){
            require(currentAllowance >= amount, "ERC20: Current allowance is not enough to spend the intended amount");
        unchecked{
            _approve(owner, spender, currentAllowance - amount);
        }
        }
    }

    function _mint(address account, uint256 amount) internal{
        require(account != address(0), "ERC20: Mint from the zero address is not valid.");
        _totalSupply += amount;
        _balances[account] += amount;

        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: Burn from the zero address is not valid.");
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: Amount should be less or equal to actual account's balance");
        _balances[account] -= amount;
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }

}
