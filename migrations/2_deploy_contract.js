const ProgPayETH = artifacts.require("ProgPayETH");

module.exports = function(deployer) {
  deployer.deploy(ProgPayETH, "0xa0759e5069bd17919ed7426bc3D246b610D7362e","0xc28DAFE415B15465BFbEEaE8D203843Bf5D61DF5","12300000000000000000","3","300");
};
