const DECIMAL = 8;
const INITIAL_ANSWER = 300000000000;
const developmentChains = ["hardhat", "local"]; //网络与本地链
const LOCK_TIME = 180; //锁定时间,20秒
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

//导出两个常量,以便在其他模块中使用
module.exports = {
  DECIMAL,
  INITIAL_ANSWER,
  developmentChains,
  networkConfig,
  LOCK_TIME,
  CONFIRMATIONS,
};
