
import React from "react";
import ShowPaymentTable from "./ShowPaymentTable";
import DissolveFunctions from "./DissolveFunctions";

import HowItWorks from './HowItWorks';

import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

class GetContractInfo extends React.Component {

constructor(props){
  super(props);
  this.state = {dissolve:false, ethBalance:null, howItWorks:false};
  this.handleApproveDeposit = this.handleApproveDeposit.bind(this);
  this.handleInitialDeposit = this.handleInitialDeposit.bind(this);
  this.handleHowItWorks = this.handleHowItWorks.bind(this);
  this.handleDissolveFunctionsToggle = this.handleDissolveFunctionsToggle.bind(this);
}

handleHowItWorks(){
  this.setState({howItWorks:!this.state.howItWorks});
}


 componentDidMount() {
    //access drizzle props within componentDidMount
    const {drizzle} = this.props;
    const {drizzleState} = this.props;

    const contract = drizzle.contracts[this.props.contractId];



    var payeeIndex = contract.methods["payee"].cacheCall();
    var payerIndex = contract.methods["payer"].cacheCall();
    var contractValueIndex = contract.methods["contractValueInWei"].cacheCall();
    var numberOfPaymentsIndex = contract.methods["numberOfPayments"].cacheCall();
    var fundedIndex = contract.methods["contractFunded"].cacheCall();
    var nextPaymentIndex = contract.methods["nextPayment"].cacheCall();
    var remainingBalanceIndex = contract.methods["remainingBalance"].cacheCall();
    var terminatedIndex = contract.methods["contractTerminated"].cacheCall();
    //var ethBalance = drizzleState.accountBalances[drizzleState.accounts[0]];

    if (this.props.contractId==="DynamicProgPayDAI") {
      var approvedToTransferIndex = contract.methods["approvedToTransfer"].cacheCall();
      var accountDAIBalanceIndex = drizzle.contracts.DAIContract.methods['balanceOf'].cacheCall(drizzleState.accounts[0]);
      this.setState({approvedToTransferIndex, accountDAIBalanceIndex});
    }
    var ethBalance;
    setInterval(()=>{
    web3.eth.getBalance(drizzleState.accounts[0])
    .then((result)=>{
      this.setState({ethBalance:result});
    });
  },1000);

    this.setState({payeeIndex, payerIndex, contractValueIndex, numberOfPaymentsIndex, fundedIndex, nextPaymentIndex, remainingBalanceIndex, terminatedIndex});
 }

handleDissolveFunctionsToggle(){
  this.setState({dissolve:!this.state.dissolve});
}

 handleApproveDeposit(){
   const {drizzle, drizzleState} = this.props;
   const contract = drizzle.contracts[this.props.contractId];
   const contractValue = drizzleState.contracts[this.props.contractId].contractValueInWei[this.state.contractValueIndex];
   console.log("contract address: "+contract.address+" contractValue: "+contractValue);
   const stackIdAppDep = drizzle.contracts.DAIContract.methods['approve'].cacheSend(contract.address, contractValue.value, {from: drizzleState.accounts[0], value:0});
   this.setState({ stackIdAppDep });
 }

 getStatusAppDep(){
   const { transactions, transactionStack } = this.props.drizzleState;
   // get the transaction hash using our saved `stackId`
   const txHash = transactionStack[this.state.stackIdDep];
   // if transaction hash does not exist, don't display anything
   if (!txHash) return null;

   if (transactions[txHash]){
   console.log(transactions[txHash].status);
   return transactions[txHash].status;
  }
 }
 handleInitialDeposit(){
   const {drizzle, drizzleState} = this.props;
   const contract = drizzle.contracts[this.props.contractId];
   const contractValue = drizzleState.contracts[this.props.contractId].contractValueInWei[this.state.contractValueIndex];
   const amountToSend = this.props.contractId==="DynamicProgPayETH"?contractValue.value:0;
   const stackIdDep = contract.methods['initialDeposit'].cacheSend({from: drizzleState.accounts[0], value:amountToSend});
   this.setState({ stackIdDep });
 }


 getStatusDep(){
   const { transactions, transactionStack } = this.props.drizzleState;
   // get the transaction hash using our saved `stackId`
   const txHash = transactionStack[this.state.stackIdDep];
   // if transaction hash does not exist, don't display anything
   if (!txHash) return null;

   if (transactions[txHash]){
   console.log(transactions[txHash].status);
   return transactions[txHash].status;
  }
 }

render() {
  const { drizzle, drizzleState } = this.props;
  const contract = this.props.drizzleState.contracts[this.props.contractId];
  console.log(drizzle);
  console.log(drizzleState);
  console.log(this.props.contractId);
  //console.log(drizzle.contracts.DynamicProgPayETH.address);
  let isPayer;
  let isPayee;
  //console.log("W3 "+web3.version.api);
  //console.log("dissolve? "+ this.state.dissolve);

/*
  let contractTxHash = drizzle.contracts.DynamicProgPayETH.contractArtifact.networks['5777'].transactionHash;
  let dateTimeStamp;
  let timeStampData = web3.eth.getTransaction(contractTxHash, (err, result) =>{
    return result;
  }).then((result)=>{
    //console.log(result);
    web3.eth.getBlock(result.blockNumber, (err, result) =>{
      return result;
    }).then((result)=>{
      dateTimeStamp = "was funded on "+ new Date(result.timestamp*1000)+".";
    });
  });
*/



  //console.log(drizzleState);
  const payee = contract.payee[this.state.payeeIndex];
  const payer = contract.payer[this.state.payerIndex];
  const contractValue = contract.contractValueInWei[this.state.contractValueIndex];
  const numberOfPayments = contract.numberOfPayments[this.state.numberOfPaymentsIndex];
  const contractFunded = contract.contractFunded[this.state.fundedIndex];
  const nextPayment = contract.nextPayment[this.state.nextPaymentIndex];
  const remainingBalance = contract.remainingBalance[this.state.remainingBalanceIndex];
  const terminated = contract.contractTerminated[this.state.terminatedIndex];

  //var ethBalance = drizzleState.accountBalances[drizzleState.accounts[0]];

  let ethBalance = this.state.ethBalance;
  console.log("ETH Balance "+this.state.ethBalance);
  var approvedToTransfer;
  var daiBalance;

  if (this.props.contractId==="DynamicProgPayDAI"){
    approvedToTransfer = contract.approvedToTransfer[this.state.approvedToTransferIndex];
    daiBalance = drizzleState.contracts.DAIContract.balanceOf[this.state.accountDAIBalanceIndex];
    console.log(approvedToTransfer && "ATT "+approvedToTransfer.value);
    console.log(daiBalance && "DAI Balance In Wei"+daiBalance.value);
  }

  var enoughFunds;
  var contractValue2;
  if (contractValue){
    contractValue2 = contractValue.value;
  }
  if (contractValue && this.props.contractId==="DynamicProgPayDAI"){
    daiBalance = drizzleState.contracts.DAIContract.balanceOf[this.state.accountDAIBalanceIndex];
    if (daiBalance){
      enoughFunds = Number(daiBalance.value) >= Number(contractValue.value);
    }
  }

  if (ethBalance && contractValue && this.props.contractId==="DynamicProgPayETH"){
    //ethBalance = drizzleState.accountBalances[drizzleState.accounts[0]];
    enoughFunds = ethBalance >= Number(contractValue.value);
  }
  console.log("contract value "+contractValue2);
  console.log("enoughFunds? "+enoughFunds);

  let currency = this.props.contractId==="DynamicProgPayETH"?"ETH":"DAI";

  if (nextPayment){
    //console.log("NP "+nextPayment.value);
  }

  if (payer){
    isPayer = this.props.drizzleState.accounts[0]===payer.value;
    //console.log(isPayer?"Payer":isPayee?"Payee":"Neither Payer or Payee");
  }

  if (payee){
    isPayee = this.props.drizzleState.accounts[0]===payee.value;
    //console.log(isPayer?"Payer":isPayee?"Payee":"Neither Payer or Payee");
  }

  const etherscanURL = "https://www.etherscan.io/address/"+ drizzle.contracts.DynamicProgPayETH.address;


  let statusDep = this.getStatusDep();
  let statusAppDep = this.getStatusAppDep();


    return (
      <div className="container mt-5">
      <div className="jumbotron">
      <div>
        <div>
        <h2>DecentPay
          <small className="text-muted"> simple transparent progress payments</small></h2>
        </div>
        <br/>
        <h4> Dashboard for {currency} contract <small className="text-muted font-weight-lighter"><a href={etherscanURL}>{drizzle.contracts.DynamicProgPayETH.address}</a></small></h4>
        <br/>
        <hr/>
        <br/>
        {payer && isPayer===true &&
          <div className="container">
          <div className="alert alert-info" role="alert">
          <h5 className="alert-heading">You are the <i>payer</i> on this contract!</h5> <p>The <i>payee</i> is {payee && payee.value}.</p>
          {currency === "DAI" &&
          <small className="text-muted">DAI Balance: ${daiBalance && parseFloat((web3.utils.fromWei((daiBalance.value).toString(), 'ether'))).toFixed(3)}{!enoughFunds && (contractFunded && contractFunded.value===false)?" (Insufficient DAI to Fund)":""}</small>
          }
          {currency==="ETH" &&
          <small className="text-muted">Balance: {ethBalance && parseFloat((web3.utils.fromWei((ethBalance).toString(), 'ether'))).toFixed(3)}Ξ {!enoughFunds && (contractFunded && contractFunded.value===false) && (terminated && !terminated.value)?" (Insufficient ETH to Fund)":""}</small>
          }
          </div>
          </div>
          }
        {payee && isPayee===true &&
        <div className="container">
        <div className="alert alert-info" role="alert">
        <h5 className="alert-heading">You are the <i>payee</i> on this contract!</h5> <p>The <i>payer</i> is {payer && payer.value}.</p>
        {currency==="DAI" &&
        <small className="text-muted">DAI Balance: ${daiBalance && parseFloat((web3.utils.fromWei((daiBalance.value).toString(), 'ether'))).toFixed(3)}</small>
        }
        {currency==="ETH" &&
        <small className="text-muted">Balance: {ethBalance && parseFloat((web3.utils.fromWei((ethBalance).toString(), 'ether'))).toFixed(3)}Ξ</small>
        }
        </div>
        </div>
      }

      <div className="container">
      <div className="row text-center">

      <div className="col">
      <div className="alert alert-secondary" role="alert">
      <h6 className="alert-heading">Contract Funded?</h6>
      <hr/>
      {contractFunded && contractFunded.value===false?(payer && isPayer===true && contractFunded && contractFunded.value===false && terminated && terminated.value===false)?
        <div>
          <button
          className="btn btn-secondary btn-sm"
          onClick={approvedToTransfer && approvedToTransfer.value===false?this.handleApproveDeposit:this.handleInitialDeposit}
          disabled = {statusAppDep ==="pending" || statusDep==="pending" || !enoughFunds ?true:false}>
          {approvedToTransfer && approvedToTransfer.value===false && !statusAppDep?"Approve Deposit":approvedToTransfer && approvedToTransfer.value===false && statusAppDep==="pending"?"Processing":!statusDep?'Fund Contract':statusDep==="success" || statusAppDep==="success"?'Success!':"Processing"}
          </button>
        </div>:"No":"Yes"}
      </div>
      </div>

      <div className="col">
      <div className={terminated && terminated.value===false?"alert alert-success":"alert alert-danger"} role="alert">
      <h6 className="alert-heading">Contract Status</h6>
      <hr/>
      {terminated && terminated.value===false?"Active":"Terminated"}
      </div>
      </div>
      </div>
      </div>

      <div className="container">
      <div className="row text-center">
      <div className="col">
      <div className="alert alert-secondary" role="alert">
      <h6 className="alert-heading">Contract Value</h6>
      <hr/>
      {this.props.contractId==="DynamicProgPayETH"?"":"$"}{contractValue && parseFloat((web3.utils.fromWei((contractValue.value).toString(), 'ether'))).toFixed(3)}{this.props.contractId==="DynamicProgPayETH"?"Ξ":""}
      </div>
      </div>

      <div className="col">
      <div className={"alert alert-secondary"} role="alert">
      <h6 className="alert-heading">Remaining Balance</h6>
      <hr/>
      {((contractFunded && contractFunded.value===true) || (terminated && terminated.value===true)) &&
        <div>
        {this.props.contractId==="DynamicProgPayETH"?"":"$"}{remainingBalance && parseFloat((web3.utils.fromWei((remainingBalance.value).toString(), 'ether'))).toFixed(3)}{this.props.contractId==="DynamicProgPayETH"?"Ξ":""}
        </div>
      }
      {contractFunded && contractFunded.value===false && terminated && !terminated.value &&
      <div>
      Waiting for Funding
      </div>
      }
      </div>
      </div>

      <div className="col">
      <div className="alert alert-secondary" role="alert">
      <h6 className="alert-heading">Number of Payments</h6>
      <hr/>
      {numberOfPayments && numberOfPayments.value}
      </div>
      </div>

      <div className="col">
      <div className={"alert alert-secondary"} role="alert">
      <h6 className="alert-heading">Next Payment Number</h6>
      <hr/>
      {nextPayment &&
        <div>
          {nextPayment && Number(nextPayment.value)===0?"Finished":nextPayment.value}
          </div>
      }
      </div>
      </div>

      </div>
      <br/>
      <br/>
      </div>



    { numberOfPayments && contractFunded && contractFunded.value===true && contractValue && numberOfPayments &&
      <ShowPaymentTable
      drizzle={this.props.drizzle}
      drizzleState={this.props.drizzleState}
      indexes={this.state}
      numberOfPayments={numberOfPayments.value}
      contractValue={contractValue.value}
      contractId = {this.props.contractId}
      />
    }

    { this.state.dissolve && contractFunded && contractFunded.value===true && nextPayment &&
      <DissolveFunctions
      drizzle={this.props.drizzle}
      drizzleState={this.props.drizzleState}
      indexes={this.state}
      nextPayment={nextPayment.value}
      contractId={this.props.contractId}
      />
    }
    <br/>
    { contractFunded && contractFunded.value===true &&
      <div className="container">
    <button className="btn shadow-lg btn-danger btn-sm btn-block" onClick={this.handleDissolveFunctionsToggle}>{this.state.dissolve?"Hide Dissolve Functions":"Show Dissolve Functions"}</button>
    </div>
    }

    <div className="text-center">
    <br/>
    <button type="button" className="btn btn-outline-primary btn-sm" onClick={this.handleHowItWorks}>How It Works</button>
      </div>

    {this.state.howItWorks &&
      <HowItWorks />
    }


      </div>
      </div>
      </div>
    );
  }
}

export default GetContractInfo;
