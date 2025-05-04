//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置

//脚本主题:使用tasks格式,跟合约交互:使用两个账号给合约转账,并查看合约余额和账号余额
const { task } = require("hardhat/config");

task(
  "interact-fundme",
  "跟合约交互:使用两个账号给合约转账,并查看合约余额和账号余额"
)
  //接收参数
  .addParam("addr", "fundme contract address")
  //添加参数
  .setAction(async (taskArgs, hre) => {
    //获取合约工厂
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    //获取合约实例的地址
    const fundMe = fundMeFactory.attach(taskArgs.addr);

    //加入两个账号(需要在加密变量文件添加相应变量,并且在配置文件中引用,使用)
    //创建一个数组,数据1是firstAccount,数据2是secondAccount;读取两个账号的私钥赋值给数组
    const [firstAccount, secondAccount] = await ethers.getSigners();

    //创建fundTX变量=是一个第一个账号调用fund函数,给该合约传入0.02个以太币的功能函数
    const fundTx = await fundMe.fund({ value: ethers.parseEther("0.002") });
    //调用fund函数,传入0.02个以太币
    await fundTx.wait();

    //查看该合约余额
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
    console.log(`Balance of the contract is ${balanceOfContract}`);

    //创建fundTXWithSecondAccount变量,第二个账号调用fund函数给该合约传入0.03个以太币
    const fundTxWithSecondAccount = await fundMe
      .connect(secondAccount)
      .fund({ value: ethers.parseEther("0.003") });
    await fundTxWithSecondAccount.wait();

    //第二次查看该合约余额
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(
      fundMe.target
    );
    console.log(
      `Balance of the contract is ${balanceOfContractAfterSecondFund}`
    );
    //查看第一个账号在合约中的余额
    const firstAccountbalanceInFundMe = await fundMe.fundersToAmount(
      firstAccount.address
    );
    //查看第二个账号在合约中的余额
    const secondAccountbalanceInFundMe = await fundMe.fundersToAmount(
      secondAccount.address
    );
    console.log(
      `Balance of first account ${firstAccount.address} is ${firstAccountbalanceInFundMe}`
    );
    console.log(
      `Balance of second account ${secondAccount.address} is ${secondAccountbalanceInFundMe}`
    );
  });

module.exports = {};
