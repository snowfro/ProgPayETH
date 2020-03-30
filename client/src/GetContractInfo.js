
import React from "react";
import ShowPaymentTable from "./ShowPaymentTable";
import DissolveFunctions from "./DissolveFunctions";

import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

class GetContractInfo extends React.Component {

constructor(props){
  super(props);
  this.state = {dissolve:false};
  this.handleInitialDeposit = this.handleInitialDeposit.bind(this);
  this.handleDissolveFunctionsToggle = this.handleDissolveFunctionsToggle.bind(this);
}



 componentDidMount() {
    //access drizzle props within componentDidMount
    const {drizzle} = this.props;

    const contract = drizzle.contracts.DynamicProgPayETH;


    var payeeIndex = contract.methods["payee"].cacheCall();
    var payerIndex = contract.methods["payer"].cacheCall();
    var contractValueIndex = contract.methods["contractValueInWei"].cacheCall();
    var numberOfPaymentsIndex = contract.methods["numberOfPayments"].cacheCall();
    var fundedIndex = contract.methods["contractFunded"].cacheCall();
    var nextPaymentIndex = contract.methods["nextPayment"].cacheCall();
    var remainingBalanceIndex = contract.methods["remainingBalance"].cacheCall();
    var terminatedIndex = contract.methods["contractTerminated"].cacheCall();

    this.setState({payeeIndex, payerIndex, contractValueIndex, numberOfPaymentsIndex, fundedIndex, nextPaymentIndex, remainingBalanceIndex, terminatedIndex});
 }

handleDissolveFunctionsToggle(){
  this.setState({dissolve:!this.state.dissolve});
}


 handleInitialDeposit(){
   const {drizzle, drizzleState} = this.props;
   const contract = drizzle.contracts.DynamicProgPayETH;
   const contractValue = drizzleState.contracts.DynamicProgPayETH.contractValueInWei[this.state.contractValueIndex];
   const stackIdDep = contract.methods['initialDeposit'].cacheSend({from: drizzleState.accounts[0], value:contractValue.value});
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
  const { DynamicProgPayETH } = this.props.drizzleState.contracts;
  console.log(drizzle);
  console.log(drizzleState);
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
  const payee = DynamicProgPayETH.payee[this.state.payeeIndex];
  const payer = DynamicProgPayETH.payer[this.state.payerIndex];
  const contractValue = DynamicProgPayETH.contractValueInWei[this.state.contractValueIndex];
  const numberOfPayments = DynamicProgPayETH.numberOfPayments[this.state.numberOfPaymentsIndex];
  const contractFunded = DynamicProgPayETH.contractFunded[this.state.fundedIndex];
  const nextPayment = DynamicProgPayETH.nextPayment[this.state.nextPaymentIndex];
  const remainingBalance = DynamicProgPayETH.remainingBalance[this.state.remainingBalanceIndex];
  const terminated = DynamicProgPayETH.contractTerminated[this.state.terminatedIndex];

  if (nextPayment){
    //console.log("NP "+nextPayment.value);
  }

  if (payer && payee){
    isPayer = this.props.drizzleState.accounts[0]===payer.value;
    isPayee = this.props.drizzleState.accounts[0]===payee.value;
    //console.log(isPayer?"Payer":isPayee?"Payee":"Neither Payer or Payee");
  }


  let statusDep = this.getStatusDep();


    return (
      <div>
      <h4>Progress Payment Contract Dashboard ({drizzle.contracts.DynamicProgPayETH.address})</h4>
      {
        payer && isPayer===true &&
        <div>
        <p>Looks like you are the payer on this contract! The payee is {payee && payee.value}.</p>
        {contractFunded && contractFunded.value===false && terminated && terminated.value===false &&
          <div>
          <button className="btn btn-primary" onClick={this.handleInitialDeposit} disabled = {statusDep==="pending"?true:false}>{!statusDep?'Fund Contract':statusDep==="success"?'Success!':statusDep}</button>
          </div>
        }
        </div>
      }
      {
        payee && isPayee===true &&
        <div>
        <p>Looks like you are the payee on this contract! The payer is {payer && payer.value}.</p>
        </div>
      }

      <p>Contract initial value {contractValue && (web3.utils.fromWei((contractValue.value).toString(), 'ether'))}Ξ // {numberOfPayments && numberOfPayments.value} payments.</p>

      <p>Funded: {contractFunded && contractFunded.value===false ?"No":"Yes"}</p>
      <p>Status: {terminated && terminated.value===false?"Active":"Terminated"}</p>




        {nextPayment &&
          <div>
          <p>Next payment: {nextPayment && Number(nextPayment.value)===0?"NONE":nextPayment.value}.</p>
          </div>
      }
      {((contractFunded && contractFunded.value===true) || (terminated && terminated.value===true)) &&
        <div>
      <p>Remaining balance to be paid on this contract: {remainingBalance && (web3.utils.fromWei((remainingBalance.value).toString(), 'ether'))}Ξ.</p>
        </div>
    }


    { numberOfPayments && contractFunded && contractFunded.value===true &&
      <ShowPaymentTable
      drizzle={this.props.drizzle}
      drizzleState={this.props.drizzleState}
      indexes={this.state}
      numberOfPayments={numberOfPayments.value}
      contractValue={contractValue.value}
      />
    }

    { this.state.dissolve && contractFunded && contractFunded.value===true &&
      <DissolveFunctions
      drizzle={this.props.drizzle}
      drizzleState={this.props.drizzleState}
      indexes={this.state}
      nextPayment={nextPayment.value}
      />
    }
    <br/>
    <br/>
    { contractFunded && contractFunded.value===true &&
    <button onClick={this.handleDissolveFunctionsToggle}>{this.state.dissolve?"Hide Dissolve Functions":"Show Dissolve Functions"}</button>
    }
      </div>
    );
  }
}

export default GetContractInfo;
