# 以太坊拍卖市场Dapp

## 一、初始化项目环境  

### （一）truffle框架介绍及安装  
Truffle框架就是一个帮助书写编译和发布基于Solidity的智能合约的工具。Truffle具有以下优点：

 - 首先对客户端做了深度集成。开发，测试，部署一行命令都可以搞定。不用再记那么多环境地址，繁重的配置更改，及记住诸多的命令。
 - 它提供了一套类似`maven`或`gradle`这样的项目构建机制，能自动生成相关目录，默认是基于Web的。
 - 提供了合约抽象接口，可以直接通过`var meta = MetaCoin.deployed();`拿到合约对象后，在Javascript中直接操作对应的合约函数。原理是使用了基于`web3.js`封装的`Ether Pudding`工具包。简化开发流程。
 - 提供了控制台，使用框架构建后，可以直接在命令行调用输出结果，可极大方便开发调试。
 - 提供了监控合约，配置变化的自动发布，部署流程。不用每个修改后都重走整个流程。


**NodeJS**  
首先，Truffle需要依赖NodeJS。Windows用户如果没安装的话可以访问[NodeJS官网][1]下载。安装成功后在命令行输入`node -v`和`npm -v`检查是否安装成功。

**Truffle**  
以管理员身份打开powershell，输入`npm install -g truffle`安装truffle（图中为VSCode的命令行）。  
![安装truffle][2]

**创建项目目录**  
truffle提供了很多项目模板，即是[truffle box][3]，可以快速搭建一个去中心化应用的代码骨架。简单来说，`truffle box`是将solidity智能合约、相关库、前端框架都集成在一起的集合，方便开发人员在最大程度上简化不必要的环境搭建和技术选型工作。 

创建一个项目目录，然后进行初始化。先利用`truffle box`的`webpack`模板来配置拍卖市场。  
```
$ mkdir auctionDapp
$ cd auctionDapp
$ truffle unbox webpack
```

可是在配置的过程中发生了错误，在Stackoverflow上找到了同样问题以及解决方案：[Error in unboxing truffle-react on Windows][4]  
输入以下两条命令后，耐心等待即可。  
```
npm install --global--production windows-build-tools  
npm install --global node-gyp
```  
![solution][5]  
这次再重建项目目录，就没问题了。  
![webpack配置][6]  
创建好目录后，进入该目录查看文件结构  
```
|--app          // 前端设计，包括html,css,js
|--build        // 智能合约编译后文件存储路径
|--contracts    // 智能合约文件存储路径
|--migrations   // 存放发布脚本文件
|--node_modules // 相关nodejs库文件
|--test         // 合约测试文件存放路径
|--box-img-lg.png
|--box-img-sm.png
|--LICENSE
|--package-lock.json
|--package.json
|--truffle.js
|--webpack.config.js
```
删掉contracts目录下用于测试的ConvertLib.sol,MetaCoin.sol，避免干扰。


 


  [1]: https://nodejs.org/en/
  [2]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/truffle_install.png
  [3]: https://truffleframework.com/boxes
  [4]: https://ethereum.stackexchange.com/questions/47937/error-in-unboxing-truffle-react-on-windows
  [5]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/webpack_bug.png
  [6]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/webpack_succeed.png
