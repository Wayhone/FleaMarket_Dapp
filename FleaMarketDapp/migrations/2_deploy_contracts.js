// var ConvertLib = artifacts.require('./ConvertLib.sol')
// var MetaCoin = artifacts.require('./MetaCoin.sol')

// module.exports = function (deployer) {
//   deployer.deploy(ConvertLib)
//   deployer.link(ConvertLib, MetaCoin)
//   deployer.deploy(MetaCoin)
// }
// -----------------------------------------

var FleaMarket = artifacts.require('./FleaMarket.sol')

module.exports = function (deployer) {
  deployer.deploy(FleaMarket)
}
