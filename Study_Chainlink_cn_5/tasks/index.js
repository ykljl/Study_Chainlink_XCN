//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置
// //预言机中文版
//脚本主题:导出引入的两个tasks格式的模块,这样能在配置文件中一次性引入使用
exports.deployConract = require("./deploy-fundme");
exports.interactContract = require("./interact-fundme");
