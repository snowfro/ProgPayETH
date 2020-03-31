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
      <h2>Welcome to DecentPay</h2>
      <h4>Making payment contracts a decent, and decentralized, experience. No more "the check is in the mail".</h4>
      <p>DecentPay is an Ethereum powered payment utility that allows two parties to enter into a fully transparent multi-payment contract.</p>
      <p>The paying party pre-deposits the full value of promised work into a blockchain validated payment contract that allows both parties to sequientially request
      and approve payments as progress is made. </p>
      <p> This process protects both the payer and the payee.
      <ul>
      <li>The payer is able to release payments in multiple draws based on milestone completion on the part of the payee.</li>
      <li>The payee is able to validate availability of the funds, and knows that as soon as work is completed and approved the payment will
      be completed without any unecessary fuss.</li>
      <li>In case a contract goes south, there are various options for payer and payee to dissolve the contract based on rules implemented into the platform that help
      protect both the payer and the payee.
      <ul>
      <li>If both parties are unhappy with the contract and want to withdraw they can "move to dissolve" the contract. The contract can then be immediately dissolved. </li>
      <ul>
      <li>If the next payment has not yet been requested by the payee, the payer receives the full remaining value of the contract. </li>
      <li>If the payee has already requested the next payment and both parties agree to dissolve, the payee receives the next payment and then the payer is sent the remaining funds held in the contract.</li>
      <li>Payee is restricted from requesting the next payment after moving to dissolve the contract.</li>
      <li>Payee cannot move to dissolve a contract after requesting the next payment unless payer has moved to dissolve first.</li>
      </ul>
      <li>If only one party wants to dissolve the contract they have three options:</li>
      <ul>
      <li>Convince other party to accept dissolution of the contract by "moving to dissolve" per above.</li>
      <li>Force dissolution of the contract by initiating a "cool down" timer (set during contract deployment) which once expired allows either party to immediately force the dissolution of the contract.</li>
      <ul>
      <li>Contract can continue with progress payments during this period.</li>
      <li>The timer encourages both parties to come to an agreement and continue the contract, while preventing the payee from locking the payer's funds up indefinitely.</li>
      <li>The timer is set by number of days. The "dissolve menu" on the contract dashboard will indicate when the timer will expire. At that point a button will appear allowing the contract to be forcefully dissolved.</li>
      <li>Any contract forcefully dissolved will split the next payment between the payer and the payee, and send remaining funds back to the payer.</li>
      </ul>
      <li>Force dissolution of the contract by sending all funds to a mediator address.</li>
      <ul>
      <li>Both payer and payee must set a mediator address and both mediator addresses much match.</li>
      <li>Mediator can be a third party that is willing to help payer and payee come to an agreement and distribute the funds off contract.</li>
      <li>Upon successfully dissolving the contract in this manner the mediator is sent all remaining contract funds immediately and the original payment contract is terminated.</li>
      </ul>
      </ul>
      </ul>
      </li>
      </ul>
      </p>
      <br/>
      <h4>***Each payment contract is an independent smart contract on the Ethereum blockchain.***</h4>
      <h4>***DecentPay has no control or jurisdiction over the smart contract once deployed.***</h4>
      <p>The payment contract can be deployed by anyone providing the following details:</p>
      <ul>
      <li> Payer's Ethereum address</li>
      <li> Payee's Ethereum address</li>
      <li> Total value of contract in ETH (Ξ)</li>
      <li> Number of payments</li>
      <li> Cooldown period (in days) in case one party wants to forcefully dissolve the contract </li>
      </ul>
      <p>Once you have that information simply fill in the details below using an Etherum compatible browser or extension and press deploy.
      The contract is initially deployed without any funds. In order to fund the contract the <i>payer</i> must deposit the total value of the contract which can be done throug the contract dashboard. Once funds are deposited
      they are locked into the contact terms so please verify all details in the contract after it is deployed but before it is funded!</p>
      <br/>
      <p>All interaction with the contract is handled through the contract dashboard. You must connect to the dashboard through an Ethereum compatible browser with your contract account active in order to manage your settings.</p>
      <p>Please input contract details below. Your contract address and a link to the dashboard will be shown after successful deployment.</p>

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
