const bytecode = "60c0604052601560808190527f50726f6772657373205061796d656e747320455448000000000000000000000060a090815261003e91600e9190610162565b5034801561004b57600080fd5b50604051610ec4380380610ec4833981810160405260a081101561006e57600080fd5b508051602082015160408301516060840151608090940151600080546001600160a01b038087166001600160a01b0319928316178355600180549187169190921617815560028490556003879055600d556004805461ffff191690556005556006819055929391929091908183816100e257fe5b04600f5560015b600354600101811015610134576000818152600960209081526040808320805460ff19908116909155600a835281842080549091169055600f54600b909252909120556001016100e9565b5050600354600f546002546000838152600b602052604090208054929093029003019055506101fd92505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101a357805160ff19168380011785556101d0565b828001600101855582156101d0579182015b828111156101d05782518255916020019190600101906101b5565b506101dc9291506101e0565b5090565b6101fa91905b808211156101dc57600081556001016101e6565b90565b610cb88061020c6000396000f3fe60806040526004361061019c5760003560e01c8063728b32bb116100ec578063a41e56001161008a578063da25de3c11610064578063da25de3c1461047e578063e037f88914610493578063e3cfef601461049b578063f8158ad2146104b05761019c565b8063a41e56001461042a578063ae90b2131461043f578063b812be27146104545761019c565b80637b5b4b89116100c65780637b5b4b89146103d6578063907a0870146103eb578063945aef231461040057806396fd3409146104155761019c565b8063728b32bb1461031a57806375d0c0dc1461032257806376d5c715146103ac5761019c565b80633042c99511610159578063422f963c11610133578063422f963c146102b15780634b4e6fd9146102c6578063556ff3fa146102db57806363bdb94b146103055761019c565b80633042c9951461026157806332c07120146102945780633bef8a3a146102a95761019c565b806304c2816c146101a1578063123119cd146101c85780631a2c2a2b146101f95780631e1f916a1461022257806325d056d3146102375780632d3780261461024c575b600080fd5b3480156101ad57600080fd5b506101b66104c5565b60408051918252519081900360200190f35b3480156101d457600080fd5b506101dd6104cb565b604080516001600160a01b039092168252519081900360200190f35b34801561020557600080fd5b5061020e6104da565b604080519115158252519081900360200190f35b34801561022e57600080fd5b5061020e6104e8565b34801561024357600080fd5b5061020e610599565b34801561025857600080fd5b506101b66105a2565b34801561026d57600080fd5b5061020e6004803603602081101561028457600080fd5b50356001600160a01b03166105a8565b3480156102a057600080fd5b5061020e610643565b61020e610651565b3480156102bd57600080fd5b506101b661070e565b3480156102d257600080fd5b506101b6610714565b3480156102e757600080fd5b5061020e600480360360208110156102fe57600080fd5b503561071a565b34801561031157600080fd5b5061020e61072f565b61020e6107c0565b34801561032e57600080fd5b50610337610997565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610371578181015183820152602001610359565b50505050905090810190601f16801561039e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156103b857600080fd5b5061020e600480360360208110156103cf57600080fd5b5035610a25565b3480156103e257600080fd5b506101dd610a3a565b3480156103f757600080fd5b5061020e610a49565b34801561040c57600080fd5b5061020e610aa7565b34801561042157600080fd5b5061020e610ab0565b34801561043657600080fd5b506101b6610bce565b34801561044b57600080fd5b506101dd610bd4565b34801561046057600080fd5b506101b66004803603602081101561047757600080fd5b5035610be3565b34801561048a57600080fd5b506101b6610bf5565b61020e610bfa565b3480156104a757600080fd5b506101b6610c59565b3480156104bc57600080fd5b506101dd610c74565b60055481565b6000546001600160a01b031681565b600c54610100900460ff1681565b600c54600090610100900460ff161561050057600080fd5b6000546001600160a01b031633148061052357506001546001600160a01b031633145b61052c57600080fd5b600c5460ff16151560011461054057600080fd5b600d5461054c57600080fd5b6000546001600160a01b0316331415610576576004805460ff19811660ff90911615179055610592565b6004805461ff001981166101009182900460ff16159091021790555b5060015b90565b60045460ff1681565b600d5481565b600c54600090610100900460ff16156105c057600080fd5b6000546001600160a01b03163314806105e357506001546001600160a01b031633145b6105ec57600080fd5b6000546001600160a01b031633141561061f57600780546001600160a01b0319166001600160a01b03841617905561063b565b600880546001600160a01b0319166001600160a01b0384161790555b506001919050565b600454610100900460ff1681565b600c54600090610100900460ff161561066957600080fd5b600454610100900460ff168015610682575060045460ff165b61068b57600080fd5b6000546001600160a01b03163314806106ae57506001546001600160a01b031633145b6106b757600080fd5b600c805461ffff19166101001790556000600d81905580546040516001600160a01b0390911691303180156108fc02929091818181858888f19350505050158015610706573d6000803e3d6000fd5b506001905090565b60035481565b60065481565b60096020526000908152604090205460ff1681565b600c54600090610100900460ff161561074757600080fd5b600c5460ff16151560011461075b57600080fd5b6001546001600160a01b0316331461077257600080fd5b600d5460009081526009602052604090205460ff161561079157600080fd5b600d5461079d57600080fd5b50600d546000908152600960205260409020805460ff1916600190811790915590565b600c54600090610100900460ff16156107d857600080fd5b600454610100900460ff16806107f0575060045460ff165b6107f957600080fd5b6000546001600160a01b031633148061081c57506001546001600160a01b031633145b61082557600080fd5b6007546001600160a01b03161580159061084957506008546001600160a01b031615155b801561086557506008546007546001600160a01b039081169116145b156108c057600c805461ffff19166101001790556000600d8190556007546040516001600160a01b0390911691303180156108fc02929091818181858888f193505050501580156108ba573d6000803e3d6000fd5b50610592565b6005546108d05742600555610592565b6006546005540142111561098f57600d80546000908152600b602052604080822080549083905592829055600c805461ffff191661010017905560015490513031936002900492838503926001600160a01b03169184156108fc0291859190818181858888f1935050505015801561094c573d6000803e3d6000fd5b50600080546040516001600160a01b039091169183156108fc02918491818181858888f19350505050158015610986573d6000803e3d6000fd5b50505050610592565b506000610596565b600e805460408051602060026001851615610100026000190190941693909304601f81018490048402820184019092528181529291830182828015610a1d5780601f106109f257610100808354040283529160200191610a1d565b820191906000526020600020905b815481529060010190602001808311610a0057829003601f168201915b505050505081565b600a6020526000908152604090205460ff1681565b6008546001600160a01b031681565b600454600090610100900460ff16158015610a67575060045460ff16155b610a7057600080fd5b6000546001600160a01b0316331480610a9357506001546001600160a01b031633145b610a9c57600080fd5b506000600555600190565b600c5460ff1681565b600d546000908152600b6020526040812054600c54610100900460ff1615610ad757600080fd5b600c5460ff161515600114610aeb57600080fd5b6000546001600160a01b03163314610b0257600080fd5b600d54610b0e57600080fd5b600d5460009081526009602052604090205460ff161515600114610b3157600080fd5b600d80546000908152600a60209081526040808320805460ff1916600117905583548352600b90915281205560035490541015610b7657600d80546001019055610b8b565b600c805461ffff19166101001790556000600d555b6001546040516001600160a01b039091169082156108fc029083906000818181858888f19350505050158015610bc5573d6000803e3d6000fd5b50600191505090565b60025481565b6001546001600160a01b031681565b600b6020526000908152604090205481565b303190565b600080546001600160a01b03163314610c1257600080fd5b6002543414610c2057600080fd5b600c5460ff1615610c3057600080fd5b600c54610100900460ff1615610c4557600080fd5b50600c805460ff1916600190811790915590565b6005546000901561098f574260065460055401039050610596565b6007546001600160a01b03168156fea265627a7a723058208f973d55e9f2be9752575cff6b46fa5945db5917eb1957887e38aab9a233add564736f6c63430005090032"

export default bytecode;