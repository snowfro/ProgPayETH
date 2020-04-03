import React from 'react';

import "./app.css";

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state={payer:undefined, payerIsAddress:null, payee:null, payeeIsAddress:null, contractValueInWei:null, numberOfPayments:null, dissolveDelayInSeconds:null, contractAddress:null, deployed:false, howItWorks:false, currency:"ETH", daiContract:null};
    this.handleHowItWorks = this.handleHowItWorks.bind(this);
    this.handleSetCurrency = this.handleSetCurrency.bind(this);
  }

  handleSetCurrency (event){
    console.log(event.target.value);
    const { drizzle } = this.props;
    console.log(drizzle);
    const { web3 } = drizzle;
    console.log(web3);
    let currency = event.target.value;
    let daiContracts = {1:"0x6B175474E89094C44Da98b954EedeAC495271d0F", 4:"0x8ad3aA5d5ff084307d28C8f514D7a193B2Bfe725", 5777:"0x0f8a6B96b283a3DDE83ac93193e5022970baC2bE"};
    //let { web3 } = this.props.drizzle;
    web3.eth.net.getId()
      .then((response)=>{
        this.setState({currency:currency, daiContract:currency==="DAI"?daiContracts[response]:null});
      });

    //console.log(this.state.currency);
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

  handleHowItWorks(){
    this.setState({howItWorks:!this.state.howItWorks});
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
    if(!valueInETH){
      return;
    } else {
    const valueInWei = web3.utils.toWei((valueInETH).toString(), 'ether');
    this.setState({contractValueInWei:valueInWei});
    console.log(valueInWei);
  }

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


    let contractIndex;
    let args;
    if (this.state.currency==="ETH"){
      contractIndex=0;
      args = [this.state.payer,this.state.payee,this.state.contractValueInWei,this.state.numberOfPayments,this.state.dissolveDelayInSeconds];
    } else if (this.state.currency==="DAI"){
      if (!this.state.daiContract){
        alert("DecentPay DAI contracts can only be deployed on Mainnet and Rinkeby Networks");
        return;
      }
      contractIndex=1;
      args = [this.state.payer,this.state.payee,this.state.contractValueInWei,this.state.numberOfPayments,this.state.dissolveDelayInSeconds, this.state.daiContract];
    }

    const progPayContract = new web3.eth.Contract(this.props.options.contracts[contractIndex].abi, {data:this.props.options.contracts[contractIndex].bytecode});
    console.log(progPayContract);
    console.log(args);
    web3.eth.getAccounts().then((e) => {
      var that = this;
      progPayContract.deploy({arguments:args}).send({
      from: e[0]
  }).then(function(newContractInstance){
      that.setState({deployed:true, contractAddress:newContractInstance.options.address});
      console.log(newContractInstance.options.address) // instance with the new contract address
  }).catch(err => alert("Error: Not connected to Ethereum"));



    });


    //web3.eth.getAccounts().then(e => {let firstAcc=e[0]; console.log(firstAcc)});


  }


  render(){

    console.log(this.state.currency);
    console.log(this.state.daiContract);
    console.log(this.props.drizzle);
    //console.log("opt "+this.props.options.contracts[0].abi);
    let contractURL = "https://decentpay.app/"+this.state.contractAddress;
    return (

      <div className="container mt-5">
      <div className="jumbotron">

      <div>
      <h2>DecentPay
      <small className="text-muted"> simple transparent progress payments</small>
      </h2>

      <p>DecentPay is an <a href="https://www.ethereum.org" target="_blank" rel='noreferrer noopener'>Ethereum </a>powered payment utility that allows two parties to enter into a fully decentralized multi-payment contract.</p>

      {!this.state.deployed &&
      <div>

    <div className="input-group mb-3 input-group-sm">
      <div className="input-group-prepend">
        <span className="input-group-text" id="payer">Payer</span>
      </div>
      <input type="text" className="form-control" placeholder="0x......." aria-label="Payer" aria-describedby="payer" disabled={this.state.deployed?true:false}  onChange={this.handlePayerInput.bind(this)}/>
    </div>
    {this.state.payerIsAddress===false &&
      <div className="alert alert-danger p-1" role="alert">
        Payer input is not a valid Ethereum address.
      </div>
    }
    <div className="input-group mb-3 input-group-sm">
      <div className="input-group-prepend">
        <span className="input-group-text" id="payee">Payee</span>
      </div>
      <input type="text" className="form-control" placeholder="0x......." aria-label="Payee" aria-describedby="payee"  disabled={this.state.deployed?true:false} onChange={this.handlePayeeInput.bind(this)}/>
    </div>
    {this.state.payeeIsAddress===false &&
      <div className="alert alert-danger p-1" role="alert">
        Payee input is not a valid Ethereum address.
      </div>
    }
    <div className="input-group mb-3 input-group-sm">
      <div className="input-group-prepend">
        <span className="input-group-text" id="value">Contract Value &nbsp;&nbsp;&nbsp;&nbsp;{this.state.currency==="DAI"?"$":""}</span>
      </div>
      <input className="form-control input-group-sm" placeholder="0" aria-label="Contract Value" aria-describedby="value"  type="number" disabled={this.state.deployed?true:false}  onChange={this.handleValueInput.bind(this)}/>
      {this.state.currency==="ETH" &&
      <div className="input-group-append">
        <span className="input-group-text">Ξ</span>
      </div>
    }
    </div>
    <div className="input-group mb-3 input-group-sm">
      <div className="input-group-prepend">
        <span className="input-group-text" id="numPay">Payments</span>
      </div>
      <input className="form-control" placeholder="0" aria-label="Contract Value" aria-describedby="numPay"  type="number" disabled={this.state.deployed?true:false} onChange={this.handleNumberOfPaymentsInput.bind(this)}/>
    </div>
    <div className="input-group mb-3 input-group-sm">
      <div className="input-group-prepend">
        <span className="input-group-text" id="dissolve">Dissolve Delay</span>
      </div>
      <input className="form-control" placeholder="Days" aria-label="Contract Value" aria-describedby="dissolve"  type="number" disabled={this.state.deployed?true:false} onChange={this.handleDissolveDelayInput.bind(this)}/>
    </div>

    <div className="container text-center">
    <div className="row">
    <div className="form-check col-sm">

      <label className="form-check-label" >
      <input className="form-check-input" type="radio" name="CurrencyRadio" value="ETH" onChange={this.handleSetCurrency}/>
      Ethereum
      </label>
    </div>
    <div className="form-check col-sm">

      <label className="form-check-label" >
      <input className="form-check-input" type="radio" name="CurrencyRadio" value="DAI" onChange={this.handleSetCurrency}/>
      DAI
      </label>
    </div>
    <div className="form-check disabled col-sm">
      <input className="form-check-input" type="radio" name="CurrencyRadio" value="USDC" disabled/>
      <label className="form-check-label" >
      USDc
      </label>
    </div>
    </div>
    </div>
    <br/>







      <button type="button" className="btn shadow-lg btn-primary btn-lg btn-block" onClick={this.handleDeployContract.bind(this)} disabled={(this.state.payer && this.state.payee && this.state.contractValueInWei && this.state.numberOfPayments && this.state.dissolveDelayInSeconds)?false:true}>Deploy Contract</button>
      <br/>
      </div>
    }


    {this.state.deployed &&
    <div>
    <hr/>
    <p> Congrats! Your contract has been successfully deployed!</p>
    <p> Here are your contract details:</p>
    <ul>
    <li>Currency: {this.state.currency}</li>
    <li>Payer: {this.state.payer}</li>
    <li>Payee: {this.state.payee}</li>
    <li>Contract Value: {this.state.currency==="DAI"?"$":""}{parseFloat((this.props.drizzle.web3.utils.fromWei((this.state.contractValueInWei).toString(), 'ether'))).toFixed(3)}{this.state.currency==="ETH"?"Ξ":""}</li>
    <li>Number of Payments: {this.state.numberOfPayments}</li>
    <li>Cool Down Timer: {(this.state.dissolveDelayInSeconds/60/60/24).toFixed(1).replace(/[.,]0$/, "")} day{this.state.dissolveDelayInSeconds/60/60/24===1?"":"s"}</li>
    </ul>

    <p>Your contract address is: {this.state.contractAddress}</p>
    <p>Both parties will interact with the contract using this dashboard link is: <br/><br/><a className="btn btn-primary btn-small" role="button" href={"./"+this.state.contractAddress}>{contractURL}</a></p>
    <p><b>Please copy the above infomation and store in a safe place!</b> Once you've done that follow the link above to start interacting with your contract.</p>

    </div>
    }

    <div className="text-center">

    <button type="button" className="btn btn-outline-primary btn-sm" onClick={this.handleHowItWorks}>How It Works</button>

    </div>
      {this.state.howItWorks &&
      <div>
      <br/>
      <p>The paying party pre-deposits the full value of promised work into a blockchain validated payment contract that allows both parties to sequientially request
      and approve payments as progress is made. </p>
      <p> This process protects both the payer and the payee.</p>
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
      </div>
    }

    </div>
    </div>
    </div>
    )
  }
}

export default Main;
