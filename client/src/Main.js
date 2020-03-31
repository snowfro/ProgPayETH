import React from 'react';

import bytecode from './bytecode.js';

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state={payer:undefined, payerIsAddress:null, payee:null, payeeIsAddress:null, contractValueInWei:null, numberOfPayments:null, dissolveDelayInSeconds:null, contractAddress:null, deployed:false};
  }

  handlePayerInput(event){
    if (this.props.drizzle.web3.utils.isAddress(event.target.value)){
    this.setState({payer:event.target.value, payerIsAddress:true});
    } else {
      this.setState({payerIsAddress:false})
    console.log("PAYER ADDRESS NOT AN ETHEREUM ADDRESS");
  }
    //console.log(this.state.payer);
  }


  handlePayeeInput(event){
    if (this.props.drizzle.web3.utils.isAddress(event.target.value)){
    this.setState({payee:event.target.value, payeeIsAddress:true});
  } else {
    this.setState({payeeIsAddress:false});
    console.log("PAYEE ADDRESS NOT AN ETHEREUM ADDRESS")
  }
    //console.log(this.state.payee);
  }

  handleValueInput(event){
    const { web3 } = this.props.drizzle;
    const valueInETH = event.target.value;
    const valueInWei = web3.utils.toWei((valueInETH).toString(), 'ether');
    this.setState({contractValueInWei:valueInWei});
    //console.log(valueInWei);
  }

  handleNumberOfPaymentsInput(event){
    this.setState({numberOfPayments:event.target.value});
    //console.log(this.state.payee);
  }

  handleDissolveDelayInput(event){
    const delayInDays = event.target.value;
    const delayInSeconds = delayInDays * 24*60*60;
    this.setState({dissolveDelayInSeconds:delayInSeconds});
  }

  handleDeployContract(){


    const { drizzle } = this.props;
    console.log(drizzle);
    const { web3 } = drizzle;
    console.log(web3);
    const progPayETHContract = new web3.eth.Contract(this.props.options.contracts[0].abi, {data:bytecode});
    console.log(progPayETHContract);
    let args = [this.state.payer,this.state.payee,this.state.contractValueInWei,this.state.numberOfPayments,this.state.dissolveDelayInSeconds];

    web3.eth.getAccounts().then((e) => {
      var that = this;
      progPayETHContract.deploy({arguments:args}).send({
      from: e[0]

  })
  .then(function(newContractInstance){
      that.setState({deployed:true, contractAddress:newContractInstance.options.address});
      console.log(newContractInstance.options.address) // instance with the new contract address
  });;



    });


    //web3.eth.getAccounts().then(e => {let firstAcc=e[0]; console.log(firstAcc)});


  }


  render(){

    console.log(this.state);
    let contractURL = "https://decentpay.app/"+this.state.contractAddress;
    return (
      <div>
      <h3>Welcome to the Ethereum Progress Payment dApp.</h3>
      <p>This is a utility used to establish a blockchain based digital payment contract for goods and services.</p>
      <p>There are two parties. A <i>Payer</i> and a <i>Payee</i>.
      A smart contract is deployed (by either party) that establishes a payment contract.

      An unfunded contract can be deployed by anyone as long as the following details are known in advance:</p>
      <ul>
      <li> Payer's Ethereum address</li>
      <li> Payee's Ethereum address</li>
      <li> Total value of contract in ETH (Ξ)</li>
      <li> Number of payments</li>
      <li> Cooldown period in case only one party wants to dissolve the contract </li>
      </ul>
      <br/>
      <p>Once you have that information simply fill in the details below using an Etherum compatible browser or extension and press deploy.
      The contract is initially deployed without any funds. In order to fund the contract the <i>payer</i> must deposit the total value of the contract. Once funds are deposited
      they are locked into the contact terms so please verify all details in the contract after it is deployed but before it is funded!</p>
      <br/>
      <p>Please input contract terms below. Your contract address and a link to the dashboard will be shown after successful deployment.</p>

      {!this.state.deployed &&
        <div>
      <input type="text" disabled={this.state.deployed?true:false} placeholder="Payer Address 0x000..."  onChange={this.handlePayerInput.bind(this)}/>
      <input type="text" disabled={this.state.deployed?true:false} placeholder="Payee Address 0x000..."  onChange={this.handlePayeeInput.bind(this)}/>
      <input type="number" disabled={this.state.deployed?true:false} placeholder="Contract Total Value Ξ"  onChange={this.handleValueInput.bind(this)}/>
      <input type="number" disabled={this.state.deployed?true:false} placeholder="Total Payments"  onChange={this.handleNumberOfPaymentsInput.bind(this)}/>
      <input type="number" disabled={this.state.deployed?true:false} placeholder="Dissolve Delay in Days"  onChange={this.handleDissolveDelayInput.bind(this)}/>
      <br/>
      <button onClick={this.handleDeployContract.bind(this)} disabled={(this.state.payer && this.state.payee && this.state.contractValueInWei && this.state.numberOfPayments && this.state.dissolveDelayInSeconds)?false:true}>Deploy</button>
      </div>
    }
      {this.state.payerIsAddress===false &&
      <p>Warning: Payer address input is not a valid Ethereum address.</p>}
      {this.state.payeeIsAddress===false &&
      <p>Warning: Payee address input is not a valid Ethereum address.</p>}


    {this.state.deployed &&
    <div>
    <p> Congrats! Your contract has been successfully deployed!</p>
    <p> Here are your contract details:</p>
    <ul>
    <li>Payer: {this.state.payer}</li>
    <li>Payee: {this.state.payee}</li>
    <li>Contract Value: {parseFloat((this.props.drizzle.web3.utils.fromWei((this.state.contractValueInWei).toString(), 'ether'))).toFixed(3)}Ξ</li>
    <li>Number of Payments: {this.state.numberOfPayments}</li>
    <li>Cool Down Timer: {this.state.dissolveDelayInSeconds/60/60/24} days</li>
    </ul>

    <p>Your contract address is: {this.state.contractAddress}</p>
    <p>Both parties will interact with the contract using this dashboard link is: <a href={"./"+this.state.contractAddress}>{contractURL}</a></p>
    <p><b>Please copy the above infomation and store in a safe place!</b> Once you've done that follow the link above to start interacting with your contract.</p>

    </div>
    }
    </div>
    )
  }
}

export default Main;
