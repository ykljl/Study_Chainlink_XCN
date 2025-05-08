//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置
//脚本主题:1.构造函数单元测试
//业务场景功能:
//需要测试的单元:1. 构造函数2.fund函数(存放资金)3.getFudn函数4.refund

const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { devlopmentChains } = require("../../helper-hardhat-config");

describe("测试主题:测试FundMe合约的函数", async function () {
  // this.timeout(60000); // 60秒超时
  let fundMe; //存放合约实例变量
  let fundMeSecondAccount; //存放合约实例变量
  let firstAccount; //存放合约交易发送人地址的变量
  let secondAccount; //存放合约交易发送人地址的变量
  let mockV3Aggregator; //存放MockV3Aggregator合约实例变量
  beforeEach(async function () {
    await deployments.fixture(["all"]); //加载包含所有的合约(all默认是所有的合约标签)
    firstAccount = (await getNamedAccounts()).firstAccount; //给let firstAccount赋值,获取该合约的交易发送人,账户
    secondAccount = (await getNamedAccounts()).secondAccount; //给let secondAccount赋值,获取该合约的交易发送人,账户
    const fundMeDeployment = await deployments.get("FundMe"); //获取FundMe合约
    mockV3Aggregator = await deployments.get("MockV3Aggregator"); //获取MockV3Aggregator合约
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address); //给let fundMe赋值,获取合约实例的地址
    fundMeSecondAccount = await ethers.getContract("FundMe", secondAccount); //获取合约实例
    //await new Promise((resolve) => setTimeout(resolve, 200000)); // 等待 200 秒
  });
  it("单元测试用例1:是否是合约交易发送人的地址", async function () {
    /*
    //获取合约交易发送人
    const [firstAccount] = await ethers.getSigners();
    //部署合约
    const fundMeFactory = await ethers.getContractFactory('FundMe');
    console.log('获取合约工厂成功');
    const fundMe = await fundMeFactory.deploy(300);
    console.log('部署合约成功');
    --用hardhat-deploy插件优化了部署合约,将需要的参数通过beforeEach函数封装到了变量中,不再需要部署合约代码*/
    console.log(`合约实例:${fundMe}`);
    console.log(`合约地址:${firstAccount}`);

    await fundMe.waitForDeployment();
    console.log("等待完成");

    //判断owner是否是合约交易发送人的地址
    console.log("以下开始进行断言");
    //prettier-ignore:去掉下面那行代码的格式化
    // prettier-ignore
    assert.equal((await fundMe.owner()),firstAccount);
  });
  it("单元测试用例2:测试喂价合约地址是否正确", async function () {
    /*//部署合约
    const fundMeFactory = await ethers.getContractFactory('FundMe');
    console.log('获取合约工厂成功');
    const fundMe = await fundMeFactory.deploy(300);
    console.log('部署合约成功');
    --用hardhat-deploy插件优化了部署合约,将需要的参数通过beforeEach函数封装到了变量中,不再需要部署合约代码*/
    await fundMe.waitForDeployment();
    console.log("等待完成");

    //判断owner是否是合约交易发送人的地址
    console.log("以下开始进行断言");
    //prettier-ignore:去掉下面那行代码的格式化
    // prettier-ignore
    assert.equal((await fundMe.dataFeed()), mockV3Aggregator.address);
  });
  //测试fund函数
  it("单元测试用例3:时间超出限制，窗口关闭时,存放金额为0.01ETH,大于设定金额,返回错误信息window is closed", async function () {
    await helpers.time.increase(500);
    await helpers.mine();
    await expect(
      fundMe.fund({ value: ethers.parseEther("0.1") })
    ).to.be.revertedWith("window is closed");
  });
  it("单元测试用例4:窗口时间内,窗口打开时,存放金额0.01ETH,小于设定金额,返回错误信息Send more ETH", async function () {
    await expect(
      fundMe.fund({ value: ethers.parseEther("0.001") })
    ).to.be.revertedWith("Send more ETH");
  });
  it("单元测试用例5:在窗口时间内,窗口打开时,存放金额0.1ETH大于设定金额,存放金额成功", async function () {
    // 老师的代码存不进去, 人工智能给的倒是能行;
    // console.log("以下开始存放金额");
    // await fundMe.fund({ value: ethers.parseEther("1") });
    // console.log("存放金额成功");
    // console.log("将要进行断言的值转换为字符串");
    // const balance = await fundMe.fundersToAmount(firstAccount);
    // console.log("fundersToAmount:", balance.toString());
    // console.log("以下开始进行断言");
    // expect(balance).to.equal(ethers.parseEther("1"));
    // console.log("断言成功");

    const [deployer] = await ethers.getSigners();
    await fundMe.connect(deployer).fund({ value: ethers.parseEther("0.3") });
    const balance = await fundMe.fundersToAmount(deployer.address);
    console.log("fundersToAmount:", balance.toString()); //
    expect(balance).to.equal(ethers.parseEther("0.3"));
  });
  //测试getFudn函数,存放的金额达到目标值才能调用该函数--在锁定期内，达到目标值，生产商可以提款
  it("单元测试用例6:存放金额达到目标值,非合约所有者无法调用 getFund 函数来提款", async function () {
    //存放金额
    await fundMe.fund({ value: ethers.parseEther("1") });
    await helpers.time.increase(500);
    await helpers.mine();
    await expect(fundMeSecondAccount.getFund()).to.be.revertedWith(
      "this function can only be called by owner"
    );
  });
  it("单元测试用例7:存放金额达到目标值,窗口打开后没有关闭,无法法调用 getFund 函数来提款", async function () {
    //存放金额
    await fundMe.fund({ value: ethers.parseEther("1") });
    await expect(fundMe.getFund()).to.be.revertedWith("window is not closed");
  });
  it("单元测试用例8:达到目标值,窗口已关闭,存放金额未达目标值,无法调用 getFund 函数来提款", async function () {
    //存放金额
    await fundMe.fund({ value: ethers.parseEther("0.1") });
    await helpers.time.increase(500);
    await helpers.mine();
    await expect(fundMe.getFund()).to.be.revertedWith("Target is not reached");
  });
  it("单元测试用例9:达到目标值,窗口已关闭,存放金额已达目标值,调用 getFund 函数来提款.", async function () {
    //存放金额
    await fundMe.fund({ value: ethers.parseEther("1") });
    await helpers.time.increase(500);
    await helpers.mine();
    await expect(fundMe.getFund())
      .to.emit(fundMe, "FundWithdrawByOwner")
      .withArgs(ethers.parseEther("1"));
  });
});
