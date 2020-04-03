
import React from "react";

import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

class ShowPaymentTable extends React.Component {

constructor(props){
  super(props);
  this.state ={paymentIndexes:[]};
  this.handleRequestPayment = this.handleRequestPayment.bind(this);
  this.handleApprovePayment = this.handleApprovePayment.bind(this);
}
//state = {};
/*
{
  payee && isPayee===true &&
  <div>
  <button className="btn btn-primary" onClick={this.handleRequestPayment} disabled = {statusReq==="pending"?true:false}>{!statusReq?'Request Next Payment':statusReq==="success"?'Success! Request another.':statusReq}</button>
  </div>
}
{
  <div>
  payer && isPayer===true &&
  <button className="btn btn-primary" onClick={this.handleApprovePayment} disabled = {statusApp==="pending"?true:false}>{!statusApp?'Approve Next Payment':statusApp==="success"?'Success! Approve another.':statusApp}</button>
  </div>
}*/

 componentDidMount() {

    const { drizzle } = this.props;
    const contract = drizzle.contracts[this.props.contractId];
    let paymentIndexes = [];

    for (let i=0; i<this.props.numberOfPayments; i++){
      const paymentIndex = contract.methods["paymentNumberToValue"].cacheCall(i+1);
      const requestedIndex = contract.methods["paymentNumberToRequested"].cacheCall(i+1);
      const approvedIndex = contract.methods["paymentNumberToApproved"].cacheCall(i+1);
      paymentIndexes.push({paymentIndex, requestedIndex, approvedIndex});
    }

    this.setState({paymentIndexes});
 }

 handleRequestPayment(){
   const {drizzle, drizzleState} = this.props;
   const contract = drizzle.contracts[this.props.contractId];
   const stackIdReq = contract.methods['requestPayment'].cacheSend({from: drizzleState.accounts[0], value:0});
   this.setState({ stackIdReq });
 }

 handleApprovePayment(){
   const {drizzle, drizzleState} = this.props;
   const contract = drizzle.contracts[this.props.contractId];
   const stackIdApp = contract.methods['approvePayment'].cacheSend({from: drizzleState.accounts[0], value:0});
   this.setState({ stackIdApp });
 }

 getStatusReq(){
   const { transactions, transactionStack } = this.props.drizzleState;
   // get the transaction hash using our saved `stackId`
   const txHash = transactionStack[this.state.stackIdReq];
   // if transaction hash does not exist, don't display anything
   if (!txHash) return null;

   if (transactions[txHash]){
   console.log(transactions[txHash].status);
   return transactions[txHash].status;
  }
 }

 getStatusApp(){
   const { transactions, transactionStack } = this.props.drizzleState;
   // get the transaction hash using our saved `stackId`
   const txHash = transactionStack[this.state.stackIdApp];
   // if transaction hash does not exist, don't display anything
   if (!txHash) return null;

   if (transactions[txHash]){
   console.log(transactions[txHash].status);
   return transactions[txHash].status;
  }
 }



render() {

  const { drizzle} = this.props;
  const contract = this.props.drizzleState.contracts[this.props.contractId];
  //console.log(drizzle);
  //console.log(drizzleState);
  console.log(drizzle.contracts[this.props.contractId].address);
  let isPayer;
  let isPayee;
  const payee = contract.payee[this.props.indexes.payeeIndex];
  const payer = contract.payer[this.props.indexes.payerIndex];
  const nextPayment = contract.nextPayment['0x0'];

  //console.log(nextPayment && "NPI "+nextPayment.value);
  //console.log('2 '+payee.value);
  //console.log('2r '+payer.value);

  if (payer){
    isPayer = this.props.drizzleState.accounts[0]===payer.value;
    //console.log(isPayer?"Payer":isPayee?"Payee":"Neither Payer or Payee");
  }

  if (payee){
    isPayee = this.props.drizzleState.accounts[0]===payee.value;
    //console.log(isPayer?"Payer":isPayee?"Payee":"Neither Payer or Payee");
  }


let paymentDetails = {};
//console.log(this.state.paymentIndexes);
paymentDetails = this.state.paymentIndexes.map(x=>{
  let rObj = {};
  rObj['paymentValue'] = contract.paymentNumberToValue[x.paymentIndex];
  rObj['requested'] = contract.paymentNumberToRequested[x.requestedIndex];
  rObj['approved'] = contract.paymentNumberToApproved[x.approvedIndex];
  return rObj;
});

let statusReq = this.getStatusReq();
//console.log("SRQ "+statusReq);
let statusApp = this.getStatusApp();

console.log(paymentDetails);
let numPayments = this.props.numberOfPayments;
let contractVal = this.props.contractValue;

    return (

      <div className="container">
      <h6>Payment Status</h6>

                {paymentDetails.map(function(payment, index){
                    return (

                      <div className={payment.requested && payment.approved && (payment.requested.value===false?"alert alert-danger":payment.requested.value===true && payment.approved.value===false?"alert alert-warning":"alert alert-success")} role="alert" key={index}>Payment #{index+1} in the amount of {this.props.contractId==="DynamicProgPayETH"?"":"$"}{parseFloat((web3.utils.fromWei((contractVal/numPayments).toString(), 'ether'))).toFixed(3)}{this.props.contractId==="DynamicProgPayETH"?"Ξ":""}
                     {payment.requested && (payment.requested.value===false?" has not been requested.   ": payment.approved && (payment.approved.value===true)?" has been requested and paid!":" has been requested and is awaiting approval/payment.   ")}

                    {
                      payee && isPayee===true && nextPayment && Number(nextPayment.value)===index+1 && payment.requested && payment.requested.value===false &&
                      <button className="btn btn-primary btn-sm" onClick={this.handleRequestPayment} disabled = {statusReq==="pending"?true:false}>{!statusReq?'Request':statusReq==="success"?'Success!':statusReq}</button>
                    }
                    {
                      payer && isPayer===true && nextPayment && Number(nextPayment.value)===index+1 && payment.requested && payment.requested.value===true &&
                      <button className="btn btn-primary btn-sm" onClick={this.handleApprovePayment} disabled = {statusApp==="pending"?true:false}>{!statusApp?'Approve':statusApp==="success"?'Success!':statusApp}</button>
                    }
                    </div>

                  )


                }, this)}
    </div>

    );
  }
}

export default ShowPaymentTable;
