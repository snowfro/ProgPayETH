import React from 'react';

import "./app.css";
import HowItWorks from './HowItWorks';

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state={payer:undefined, payerIsAddress:null, payee:null, payeeIsAddress:null, contractValueInWei:null, numberOfPayments:null, dissolveDelayInSeconds:null, contractAddress:null, deployed:false, howItWorks:false, currency:"ETH", daiContract:null, deployButtonDisabled:false};
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
    this.setState({deployButtonDisabled:true})
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
    console.log(this.state.deployButtonDisabled);
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







      <button type="button" className="btn shadow-lg btn-primary btn-lg btn-block" onClick={this.handleDeployContract.bind(this)} disabled={!(this.state.payer && this.state.payee && this.state.contractValueInWei && this.state.numberOfPayments && this.state.dissolveDelayInSeconds)||this.state.deployButtonDisabled?true:false}>{!this.state.deployButtonDisabled?'Deploy Contract':'Processing'}</button>
      <br/>
      </div>
    }


    {this.state.deployed &&
    <div>
    <hr/>
    <h4> Congrats! Your contract has been successfully deployed!</h4>
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
    <p>Both parties will interact with the contract using this dashboard link is: <br/><br/><a className="btn btn-primary btn-small btn-block" role="button" href={"./"+this.state.contractAddress}>{contractURL}</a></p>
    <p><b>Please copy the above infomation and store in a safe place!</b> Once you've done that follow the link above to start interacting with your contract.</p>

    </div>
    }

    <div className="text-center">

    <button type="button" className="btn btn-outline-primary btn-sm" onClick={this.handleHowItWorks}>How It Works</button>

    </div >
      {this.state.howItWorks &&
        <HowItWorks />
    }

    </div>
    </div>
    </div>
    )
  }
}

export default Main;
