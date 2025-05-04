//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置
//预言机英文版
//导入模块
const { ethers } = require("hardhat");
// const solc = require("solc")
const fs = require("fs-extra");
const { Contract } = require("ethers");
require("dotenv").config();
//异步函数
async function main() {
  console.log("以下正在部署合同...");

  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorageFactory.deploy();

  // 等待合约部署完成
  // await simpleStorage.waitForDeployment();
  await simpleStorage.waitForDeployment();

  console.log(`合同已部署到:${simpleStorage.target}`); // 输出合约地址

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");

    // Not functionable in version 6^ ethers ----->

    await simpleStorage.deploymentTransaction().wait(6);
    await verify(simpleStorage.target, []);

    //______________________________________________
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  // Update the current value
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updatedValue}`);
}

async function verify(contractAddress, args) {
  // const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}
// const contractAddress = simpleStorage.target;
//调用函数
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
