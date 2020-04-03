const ProgPayDAI = artifacts.require("ProgPayDAI");

module.exports = function(deployer) {
  deployer.deploy(ProgPayDAI, "0xf3860788D1597cecF938424bAABe976FaC87dC26","0x5462deE16b3f4D240EBBE52C9C4214c912ccDda4","100000000000000000","3","300", "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8");
};
