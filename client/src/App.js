import React, { Component } from 'react';
import GetContractInfo from './GetContractInfo';


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
      //drizzle.store.dispatch({type: 'ADD_CONTRACT', contractConfig});
      drizzle.addContract(contractConfig);
      }

      this.setState({ cAddress:isETHAddress});

      this.checkIfProgPayETHContract();

    }, 500)


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


    checkIfProgPayETHContract(){

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
      {contractName && contractName.value==="Progress Payments ETH" &&

      <GetContractInfo
      drizzle={this.props.drizzle}
      drizzleState={this.state.drizzleState}
      />

    }
      {contractName && contractName.value !=="Progress Payments ETH" &&
      <p>This is not a supported contract.</p>
    }
      </div>

      )
  }
}export default App;
