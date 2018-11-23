# 拍卖市场_以太坊Dapp

---

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

> 如果你是Windows用户，那就需要注意：Windows 系统有个命名问题，它会让我们在执行 Truffle 命令的时候只打开配置文件"truffle.js"，而不会读取里面的内容。解决方法是。修改Windows的PATHEXT环境变量，去掉.js后缀，避免以后在Truffle目录下运行"truffle"命令可能遇到的麻烦。

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

---

## 二、编写智能合约   

---

## 三、测试结果  

智能合约必须要部署到链上进行测试。可以选择部署到一些公共的测试链比如Rinkeby或者Ropsten上，缺点是部署和测试时间比较长，显然对于我们的项目来说是不太现实的。还有一种方式就是部署到私链上，Truffle官方推荐使用以下两种客户端：

 - Ganache 
 - truffle develop

Ganache本质上是一个本地ethereum节点仿真器，分为GUI版本和命令行版本。喜欢GUI的可以安装[GUI_Ganache][7]，CLI版本则可以通过`sudo npm install -g ganache-cli`安装。  

如果对GUI没有要求的话，其实个人更推荐使用truffle develop，可以免去安装步骤。它是truffle内置的客户端，跟命令行版本的Ganache基本类似。唯一要注意的是在truffle develop里执行truffle命令的时候需要省略前面的`truffle`，比如`truffle compile`只需要敲`compile`就可以了。

我们选择的是`truffle develop`。VSCode下Ctrl+\` 打开命令行，输入 `truffle compile`，编译合约。`compile`命令会将我们的 Solidity 代码编译为字节码（以太坊虚拟机（EVM）能够识别并执行的代码）。如果编译出现了warning最好解决一下，因为在以太坊中，智能合约一旦部署之后，就再也无法改变源码，因此最好谨慎地对待代码。编译成功后如下图所示：  
![compile][8]  

接下来是部署合约。输入命令`truffle migrate`，出现报错，如图所示。  
![migrate_error][9]  
`migrate`命令会将代码部署到区块链上。出现上图的错误是因为没有指定网络，如使用命令`truffle migrate --network ourTestNet`指定部署到私链ourTestNet中。现在我们只需要有一个用于测试的网络就好了，也就是上面所提到过的，使用`truffle develop`。输入该命令，启动测试终端。  
![develop][10]
由图可见，`truffle develop`在https://127.0.0.1:9545端口启动，启动时会给用户生成测试账号，在默认情况下这些测试账号都有 100 个以太币，并且这些以太币都会处于解锁状态，能让我们自由发送它们的以太币。  

然后这次可以部署合约了，注意在这里执行truffle命令的时候需要省略前面的`truffle`。  
![migrate_develop][11]

部署成功了，接下来开始测试。当然你可以使用Solidity智能合约版本的单元测试，单元测试智能合约存放在test目录下。一般来讲，这种文件的命名规则是Test加待测智能合约的名字拼串组成。但是为了更直观、逐步地看出拍卖过程和信息地变化，这里不使用单元测试，而是直接获取合约实例，逐步地调用各函数。  

执行命令`AuctionStore.deployed().then(instance => {auctionInstance = instance})`。这行命令会将 truffle 部署的合约的实例的一个引用赋给 auctionInstance 变量，方便之后调用函数。

我们假设一个场景：用户0（默认的msg.sender）发布了一个商品——iPhoneX，有用户1-4进行投标。先查看一下4个投标者的初始余额，均为100以太币。 

![getInstance & check the bidders][12]

设置一些变量，包括拍卖起始时间、拍卖结束时间、商品起始价格。这里先获取当前时间，拍卖在3分钟（180s）后开始；拍卖持续5分钟（300s）；商品其实价格为2个以太币。

![set the var][13]

用户0开始发布商品iPhone。这里因为测试的缘故，描述图片和描述文字的哈希就没必要放进去了，留到实现前端的时候完善。由图可见，发布该商品花费了 258812 gas。然后使用`getProductNum()`，可以看到当前有一个商品发布再使用`getProduct(1)`，可以看到商品信息。  

![add a product][14]  
![get the product][15]

如果在商品开始拍卖前进行投标，操作会被拒绝。在商品发布三分钟后，4个用户要进行投标。先看用户1，以密匙"test1"进行加密，出价1.5倍初始价格，即是3个以太币。投标操作花费 110370 gas。如果用户1还想更改出价/更改竞拍密匙，操作将会被取消。  

![bid][16]

同理，用户2、3、4都进行投标，分别出价4个以太币、6个以太币、5个以太币。  


这时调用`getBidNum(1)`可以看到竞拍商品1（iPhoneX）的人数。然后查看当前四个用户的余额，可以看到除了消耗的部分gas外，4人分别花费了3/4/6/5个币。
![getBidNum][17]

等到竞拍的5分钟结束后，可以开始揭标。揭标需要输入之前的竞拍密匙，确保安全。  

第一个揭标的是用户1：由于现在只有用户1揭标，即是说暂时的最高竞价者是ta，而商品第二高价格就是其初始价格。在最终价格未确定前，暂时不会返还最高竞价者差价。

![reveal1][18]

第二个揭标的是用户2：用户2的出价比用户1高，因此ta成了最高竞价者。用户1出局，回水（把ta支付的3个以太币返还给他）。

![reveal2][19]

第二个揭标的是用户3：用户3揭标后，ta的出价又比用户2高，因此ta成了最高竞价者。用户2出局，回水（把ta支付的4个以太币返还给他）。

![reveal3][20]

最后揭标的是用户4：它的出价并没有用户3高，直接出局，回水（把ta支付的5个以太币返还给他）。

![- reveal4][21]

这个时候四个用户都揭标了， 查看一下买家是谁。

![noBuyerYet][22]

可是这时获取买家出现报错，这是因为交易并没有完全结束。最高竞价者用户3目前仍然支付的是ta自己的出价，成交时我们应该返还给他（最高价-次高价）的差价。同时，还应该修改商品的状态，判断是否成交。  

![getBuyer][23]  

最后看一下各用户的余额，用户3使用了5个以太币（次高价）获得了该商品。


  [1]: https://nodejs.org/en/
  [2]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/configuration/truffle_install.png
  [3]: https://truffleframework.com/boxes
  [4]: https://ethereum.stackexchange.com/questions/47937/error-in-unboxing-truffle-react-on-windows
  [5]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/configuration/webpack_bug.png
  [6]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/configuration/webpack_succeed.png
  [7]: https://github.com/trufflesuite/ganache/releases
  [8]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/compile.png
  [9]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/migrate_error.png
  [10]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/develop.png
  [11]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/migrate_develop.png
  [12]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_bidders_n_getInstance.png
  [13]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_getArg.png
  [14]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_addProduct.png
  [15]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_getProduct.png
  [16]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_bid.png
  [17]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_getBidNum.png
  [18]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_bid1.png
  [19]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_bid2.png
  [20]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_bid3.png
  [21]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_bid4.png
  [22]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_noBuyerYet.png
  [23]: https://github.com/sysuxwh/MyPictureHost/blob/master/AuctionDapp/test/test_endAuction.png
