const ProgPayETH = artifacts.require("ProgPayETH");

module.exports = function(deployer) {
  deployer.deploy(ProgPayETH, "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C","1000000000000000000","9","180");
};
