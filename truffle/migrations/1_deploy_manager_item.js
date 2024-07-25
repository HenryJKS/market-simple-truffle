const ManagerItem = artifacts.require("ManagerItem");

module.exports = function (deployer, network, accounts) {
  const initialOwner = accounts[0];
  deployer.deploy(ManagerItem, initialOwner);
};
