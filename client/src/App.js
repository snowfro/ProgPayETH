import React, { Component } from 'react';
import GetContractInfo from './GetContractInfo';
import DaiContractABI from './DaiContractABI';

//import Web3 from 'web3';
//const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");



class App extends Component {
  state = { loading: true, drizzleState: null, cAddress:null, contractAdded:false };

  componentDidMount() {
    const { drizzle } = this.props;

    setTimeout(() => {
      const { web3 } = drizzle;
      const address = this.props.match.params.address;
      //console.log(web3);

      let isETHAddress = web3.utils.isAddress(address)?address:false;
      console.log(isETHAddress);
      if (isETHAddress){

      var contractConfig = {
        contractName: "DynamicProgPayETH",
        web3Contract: new web3.eth.Contract(this.props.options.contracts[0].abi,isETHAddress)
      }

      var contractConfig2 = {
        contractName: "DynamicProgPayDAI",
        web3Contract: new web3.eth.Contract(this.props.options.contracts[1].abi,isETHAddress)
      }

      let daiContracts = {1:"0x6B175474E89094C44Da98b954EedeAC495271d0F", 3:"0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8", 4:"0x8ad3aA5d5ff084307d28C8f514D7a193B2Bfe725", 5777:"0x0f8a6B96b283a3DDE83ac93193e5022970baC2bE"};
      let contractConfig3;
      web3.eth.net.getId()
        .then((response)=>{
          contractConfig3 = {
            contractName: "DAIContract",
            web3Contract: new web3.eth.Contract(DaiContractABI,daiContracts[response])
          }
          drizzle.addContract(contractConfig3);
        });


      //drizzle.store.dispatch({type: 'ADD_CONTRACT', contractConfig});
      drizzle.addContract(contractConfig);
      drizzle.addContract(contractConfig2);
      }

      this.setState({ cAddress:isETHAddress});

      this.checkWhichDecentPayContract();

    }, 1000)


    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });

    }


    checkWhichDecentPayContract(){

    const {drizzle} = this.props;
    const contractNameIndex = drizzle.contracts.DynamicProgPayETH.methods['contractName'].cacheCall();
    this.setState({contractNameIndex});
    }




  compomentWillUnmount() {
    this.unsubscribe();
  }



  render() {
    //this.addContract();
    let dS = this.state.drizzleState;
    let d = this.props.drizzle;
    let contractName;
    console.log(d);
  if (dS && dS.contracts.DynamicProgPayETH){
    console.log("DrizzleState");
    console.log(dS);
    contractName = dS.contracts.DynamicProgPayETH.contractName[this.state.contractNameIndex];
   }
   let isContract;
   if (contractName){
     isContract = contractName.value === "DecentPay ETH" || contractName.value === "DecentPay DAI";
   }
    //let contractName;
    //if (this.state.drizzleState.contracts.DynamicProgPayETH){
    //console.log('kie');
  //  }
    //console.log(contractName && "test"+contractName.value);



    if (this.state.loading) return "Loading Drizzle...";
    if (!this.state.cAddress) return "Loading Drizzle...";
    //if (contractName && contractName.value!="Progress Payments ETH") return "This is NOT a valid contract.";
    //if (contractName && contractName.value!="Progress Payments ETH") return "This is not a compatible contract.";


    return(
            <div>
      {contractName && (contractName.value==="DecentPay ETH" || contractName.value==="DecentPay DAI") &&

      <GetContractInfo
      drizzle={this.props.drizzle}
      drizzleState={this.state.drizzleState}
      contractId={contractName&&contractName.value==="DecentPay ETH"?"DynamicProgPayETH":"DynamicProgPayDAI"}
      />

    }
      {!isContract &&
      <p>This is not a supported contract.</p>
    }
      </div>

      )
  }
}export default App;
