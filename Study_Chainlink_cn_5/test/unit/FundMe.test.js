//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置
//脚本主题:1.构造函数单元测试
//业务场景功能:
const { assert } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");

describe("测试主题:测试FundMe函数", async function () {
  let fundMe; //存放合约实例变量
  let firstAccount; //存放合约交易发送人地址的变量
  beforeEach(async function () {
    await deployments.fixture(["all"]); //加载包含所有的合约(all默认是所有的合约标签)
    firstAccount = (await getNamedAccounts()).firstAccount; //给let firstAccount赋值,获取交易发送人,账户
    const fundMeDeploy = await deployments.get("FundMe"); //获取合约
    fundMe = await ethers.getContractAt("FundMe", fundMeDeploy.address); //给let fundMe赋值,获取合约实例的地址
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
    assert.equal((await fundMe.owner()),);
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
    assert.equal((await fundMe.dataFeed()), "0x694AA1769357215DE4FAC081bf1f309aDC325306");
  });
});
