//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置
//预言机中文版
//脚本主题:1.导入相关功能包2.引用加密的环境变量来部署合约3.创建if判断,符合条件就验证合约的函数,并引用
//业务场景功能:暂无?
//导入模块
const { ethers } = require("hardhat");

//异步函数
async function main() {
  console.log("以下正在部署合同...");

  // 获取合约工厂并部署合约
  const fundMeFactoy = await ethers.getContractFactory("FundMe");
  console.log("获取合约工厂成功");
  // 部署合约，传入初始值20
  const fundMe = await fundMeFactoy.deploy(20);
  console.log("部署合约成功");

  // 等待合约部署完成，获取交易回执
  await fundMe.waitForDeployment();

  // 输出合约地址
  console.log(`合同已部署到: ${fundMe.target}`);

  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("以下开始等待七个区块...");
    await fundMe.deploymentTransaction().wait(5);
    // 等待5个区块确认,调用verify函数deployTransaction
    await verifyFundMe(fundMe.target, [20]);
  } else {
    console.log("不是sepolia网络,或者没有API,跳过验证...");
  }
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
