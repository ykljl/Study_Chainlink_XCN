require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config(); //导入加密环境变量文件
//require('@nomicfoundation/hardhat-verify'); //合约部署后自动验证合约源代码并将其与区块链上的实际合约进行匹配
require("./tasks"); //导入任务文件
require("hardhat-deploy"); //导入hardhat-deploy插件,测试用
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy-ethers");

//设置代理
const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent("http://192.168.1.187:7897");
setGlobalDispatcher(proxyAgent);

const SEPOLIA_SEPOLIA_RPC_URL = process.env.SEPOLIA_SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.26",
  defaultNetwork: "hardhat",
  //集成测试总等待时间300秒
  mocha: {
    timeout: 300000,
  },
  networks: {
    sepolia: {
      url: SEPOLIA_SEPOLIA_RPC_URL, // 使用环境变量中SEPOLIA_SEPOLIA_RPC_URL,测试网的url
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1], // 使用环境变量中的PRIVATE_KEY,钱包的私钥
      chainId: 11155111, // Sepolia 测试网的链 ID
      //blockConfirmations: 6, // 等待 6 个区块确认
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY, // sepolia网络的 API 密钥
    },
  },
  sourcify: {
    enabled: true, // 启用 Sourcify 验证
  },
  //调用该配置文件中的配置名时,会调用配置名下的配置,例如deployer的default是0,就会调用序号为0的账户地址
  namedAccounts: {
    firstAccount: {
      default: 0, // 序号为1的账户地址
    },
    secondAccount: {
      default: 1, // 序号为0的账户地址
    },
  },
  gasReporter: {
    enabled: true,
    //enabled: false,
  },
};
// Hardhat 中 hardhat-deploy 插件的一部分，它用于给部署脚本打标签（tags）
// 'all'：这个标签通常用于标记所有的部署脚本。通过这个标签，你可以执行所有脚本。
// 'FundMe'：这是为当前脚本专门指定的标签，标记为与 FundMe 相关的部署脚本。
module.exports.tags = ["all", "FundMe"]; //给所有的合约添加标签
