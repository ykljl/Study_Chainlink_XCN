//SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// 1. 创建一个收款函数
// 2. 记录投资人并且查看
// 3. 在锁定期内，达到目标值，生产商可以提款
// 4. 在锁定期内，没有达到目标值，投资人在锁定期以后退款

//需要测试的单元
// 1. 构造函数2.fund函数(存款)3.getFudn函数4.refund

contract FundMe {
    mapping(address => uint256) public fundersToAmount;
    //存放金额限制最低为1美元
    uint256 constant MINIMUM_VALUE = 1 * 10 ** 18; //USD
    //声明，表示你在合约内部使用 AggregatorV3Interface 类型的变量 dataFeed
    //写测试用例,为了调用dataFeed,更改权限
    AggregatorV3Interface public dataFeed;
    //目标值为10美元
    uint256 constant TARGET = 10 * 10 ** 18;

    address public owner;

    uint256 deploymentTimestamp;
    uint256 lockTime;

    address erc20Addr;

    bool public getFundSuccess = false;
    event FundWithdrawByOwner(uint256);
    event RefundByFunder(address, uint256);

    constructor(uint256 _lockTime,address dataFeedAddr) {
        // sepolia testnet,喂价合约地址
        
        dataFeed=AggregatorV3Interface(dataFeedAddr);
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    function fund() external payable {
        //
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE, "Send more ETH");
        //当前时间戳小于合约部署时的时间戳+设置的时间现在返回 "window is closed"
        require(block.timestamp < deploymentTimestamp + lockTime, "window is closed");
        fundersToAmount[msg.sender] += msg.value;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal view returns(uint256){
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 ** 8);
    }

    function transferOwnership(address newOwner) public onlyOwner{
        owner = newOwner;
    }

    function getFund() external windowClosed onlyOwner{
        require(convertEthToUsd(address(this).balance) >= TARGET, "Target is not reached");
        // transfer: transfer ETH and revert if tx failed
        // payable(msg.sender).transfer(address(this).balance);
        
        // send: transfer ETH and return false if failed
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success, "tx failed");
        
        // call: transfer ETH with data return value of function and bool 
        bool success;
        uint256 balance=address(this).balance;
        (success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "transfer tx failed");
        fundersToAmount[msg.sender] = 0;
        getFundSuccess = true; // flag
        //emit event
        emit FundWithdrawByOwner(balance);

    }

    function refund() external windowClosed {
        require(convertEthToUsd(address(this).balance) < TARGET, "Target is reached");
        require(fundersToAmount[msg.sender] != 0, "there is no fund for you");
        bool success;
        uint256 balance=fundersToAmount[msg.sender];
        (success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "transfer tx failed");
        fundersToAmount[msg.sender] = 0;
        emit RefundByFunder(msg.sender,balance);
    }

    function setFunderToAmount(address funder, uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr, "you do not have permission to call this funtion");
        fundersToAmount[funder] = amountToUpdate;
    }

    function setErc20Addr(address _erc20Addr) public onlyOwner {
        erc20Addr = _erc20Addr;
    }

    modifier windowClosed() {
        require(block.timestamp >= deploymentTimestamp + lockTime, "window is not closed");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "this function can only be called by owner");
        _;
    }

}