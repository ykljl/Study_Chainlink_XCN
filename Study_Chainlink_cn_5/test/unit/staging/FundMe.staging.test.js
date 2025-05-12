//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置
//脚本主题:1.构造函数单元测试
//业务场景功能:
//需要测试的单元:1. 构造函数2.fund函数(存放资金)3.getFudn函数4.refund

const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { assert, expect } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
//本地链用单元测试,网络链用集成,导入该文件用来判断是哪个
const { developmentChains } = require("../../../helper-hardhat-config");

//developmentChains包含network.name就运行以下代码,不包含就跳过
console.log(`当前网络: ${network.name}`);
developmentChains.includes(network.name)
  ? describe.skip
  : describe("测试主题:集成测试", async function () {
      // this.timeout(60000); // 60秒超时
      let fundMe; //存放合约实例变量
      let firstAccount; //存放合约交易发送人地址的变量
      beforeEach(async function () {
        await deployments.fixture(["all"]); //加载包含所有的合约(all默认是所有的合约标签)
        // [owner, funder] = await ethers.getSigners(); // 获取第一个和第二个账户
        firstAccount = (await getNamedAccounts()).firstAccount; //给let firstAccount赋值,获取该合约的交易发送人,账户
        const fundMeDeployment = await deployments.get("FundMe"); //获取FundMe合约
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address); //给let fundMe赋值,获取合约实例的地址
      });
      // 成功存放资金后成功提款;
      it("fund and getFund successfully", async function () {
        // make sure target reached
        await fundMe.fund({ value: ethers.parseEther("0.01") }); // 3000 * 0.5 = 1500
        // make sure window closed
        await new Promise((resolve) => setTimeout(resolve, 181 * 1000));
        // make sure we can get receipt
        const getFundTx = await fundMe.getFund();
        const getFundReceipt = await getFundTx.wait();
        expect(getFundReceipt)
          .to.be.emit(fundMe, "FundWithdrawByOwner")
          .withArgs(ethers.parseEther("0.01"));
      });
      //成功存放资金后成功退款
      it("集成测试用例2:存放资金并且退款.", async function () {
        // 存款金额为0.002ETH,小于合约中的100美元存款目标限制
        await fundMe.fund({ value: ethers.parseEther("0.001") }); //(2410.3 $ Per Ether)2410 * 0.01 = 24
        // 确保窗口已经关闭,设置关闭时间为181秒
        await new Promise((resolve) => setTimeout(resolve, 181 * 1000));
        // 确保收到合约部署成功的回执
        const refundTx = await fundMe.refund();
        const reFundReceipt = await refundTx.wait();
        expect(reFundReceipt)
          .to.be.emit(fundMe, "RefundByFunder")
          .withArgs(firstAccount, ethers.parseEther("0.001"));
      });
    });
