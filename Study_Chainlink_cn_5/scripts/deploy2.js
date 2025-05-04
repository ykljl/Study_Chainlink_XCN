//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置
//预言机中文版
//脚本主题:1.跟合约交互:使用两个账号给合约转账,并查看合约余额和账号余额
//发现问题:1.注意合约的金额限制
//业务场景功能:可以使用账号存钱到该合约中,并查看合约余额和账号余额
//导入模块
const { ethers } = require("hardhat");

//异步函数
async function main() {
  console.log("以下正在部署合同...");

  // 获取合约工厂并部署合约
  const fundMeFactoy = await ethers.getContractFactory("FundMe");
  console.log("获取合约工厂成功");
  // 部署合约，传入初始值300,等待300秒
  const fundMe = await fundMeFactoy.deploy(300);
  console.log("部署合约成功");

  // 等待合约部署完成，获取交易回执
  await fundMe.waitForDeployment();

  // 输出合约地址
  console.log(`合同已部署到: ${fundMe.target}`);

  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("以下开始等待5个区块...");
    await fundMe.deploymentTransaction().wait(5);
    // 等待5个区块确认,调用verify函数deployTransaction
    await verifyFundMe(fundMe.target, [300]);
  } else {
    console.log("不是sepolia网络,或者没有API,跳过验证...");
  }
  //加入两个账号(需要在加密变量文件添加相应变量,并且在配置文件中引用,使用)
  //创建一个数组,数据1是firstAccount,数据2是secondAccount;读取两个账号的私钥赋值给数组
  const [firstAccount, secondAccount] = await ethers.getSigners();

  //创建fundTX变量=是一个第一个账号调用fund函数,给该合约传入0.02个以太币的功能函数
  const fundTx = await fundMe.fund({ value: ethers.parseEther("0.02") });
  //调用fund函数,传入0.02个以太币
  await fundTx.wait();

  //查看该合约余额
  const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
  console.log(`合约余额为: ${balanceOfContract}`);
  //创建fundTXWithSecondAccount变量,第二个账号调用fund函数给该合约传入0.03个以太币
  const fundTXWithSecondAccount = await fundMe
    .connect(secondAccount)
    .fund({ value: ethers.parseEther("0.03") });
  await fundTXWithSecondAccount.wait();
  //第二次查看该合约余额
  const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(
    fundMe.target
  );
  console.log(`第二次查看合约余额,余额为: ${balanceOfContractAfterSecondFund}`);
  //查看第一个账号在合约中的余额
  const firstAccountbalanceInFundMe = await fundMe.fundersToAmount(
    firstAccount.address
  );
  //查看第二个账号在合约中的余额
  const secondAccountbalanceInFundMe = await fundMe.fundersToAmount(
    secondAccount.address
  );
  console.log(
    `第一个账号在合约中的地址为:${firstAccount.address},余额为: ${firstAccountbalanceInFundMe}`
  );
  console.log(
    `第二个账号在合约中的地址为:${secondAccount.address},余额为: ${secondAccountbalanceInFundMe}`
  );
}
//验证合约
//通过编程方式调用合约验证（verify:verify）命令
async function verifyFundMe(fundMeAddr, args) {
  await hre.run("verify:verify", {
    address: fundMeAddr,
    constructorArguments: args,
  });
}

//调用函数
main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
