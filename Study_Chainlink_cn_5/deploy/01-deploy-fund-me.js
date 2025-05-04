//主题:优化代码,使用deploy部署合约

//引入调用getNamedAccounts,调用hardhat.config.js文件中的namedAccounts配置,deployments用来部署函数
//定义异步（async）模块导出函数，作为部署脚本在 hardhat 执行时被调用
//getNamedAccounts 和 deployments 是由 hardhat-deploy 插件提供的对象，它们会传递给你以供你进行合约部署。你可以通过这两个对象来获取账户信息和执行合约部署。
module.exports = async ({ getNamedAccounts, deployments }) => {
  //调用 getNamedAccounts() 函数来获取账户列表，并使用解构赋值将 firstAccount 提取出来.getNamedAccounts() 返回一个对象，包含所有已命名的账户。一般来说，这些账户在 hardhat.config.js 中配置过
  const { firstAccount } = await getNamedAccounts();
  //从 deployments 对象中提取出 deploy 方法，它是 hardhat-deploy 插件提供的用于部署合约的函数。通过 deploy 方法来部署指定的合约
  const { deploy } = deployments;
  //调用 deploy 方法来部署名为 'FundMe' 的合约。'FundMe' 是你想要部署的合约名称，应该与合约文件名一致
  await deploy('FundMe', {
    //部署名叫firstAccount的账户,这个账户是通过 getNamedAccounts() 函数从hardhat.config.js文件中获取的
    from: firstAccount,
    //传递部署合约时的构造函数参数。这里的 args 是合约构造函数所需要的参数。
    args: [180], //
    //启用日志输出。log: true 表示在部署过程中会打印相关日志信息，包括合约的部署地址等信息.hardhat-deploy 提供的配置项
    log: true,
    // waitConfirmations: confirmations,
  });
};
module.exports.tags = ['all', 'FundMe'];
