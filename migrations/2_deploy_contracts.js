const Marketplace = artifacts.require("Marketplace");
// create migrations to migrate the block chain from one state to another by adding the smart contract on it
module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};
