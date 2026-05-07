// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Vault {
    mapping(address => uint) private balences;
    uint public totalDeposit;

    event Deposit(address from, uint256 amount);
    event Withdraw(address to, uint256 amount);

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        require(msg.value >= 1000000000000000000, "Minimun Ether");
        balences[msg.sender] += msg.value;
        totalDeposit += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public {
        require(_amount <= balences[msg.sender], "Wrong withdraw amount");
        balences[msg.sender] -= _amount;
        totalDeposit -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdraw(msg.sender, _amount);
    }

    function getBalance() public view returns (uint) {
        return balences[msg.sender];
    }
}
