const DECIMAL = 8;
const INITIAL_ANSWER = 300000000000;
const devlopmentChains = ["hardhat", "local"]; //本地链
const LOCK_TIME = 180; //锁定时间
const CONFIRMATIONS = 5; // 等待 5 个区块确认
const networkConfig = {
  11155111: {
    ethUsdDataFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  97: {
    ethUsdDataFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
  },
};
//测试网0x694AA1769357215DE4FAC081bf1f309aDC325306
//导出两个常量 DECTMAL 和 INITIAL_ANSWER，以便在其他模块中使用
module.exports = {
  DECIMAL,
  INITIAL_ANSWER,
  devlopmentChains,
  networkConfig,
  LOCK_TIME,
  CONFIRMATIONS,
};
