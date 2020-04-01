
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
    const contract = drizzle.contracts.DynamicProgPayETH;
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
   const contract = drizzle.contracts.DynamicProgPayETH;
   const stackIdReq = contract.methods['requestPayment'].cacheSend({from: drizzleState.accounts[0], value:0});
   this.setState({ stackIdReq });
 }

 handleApprovePayment(){
   const {drizzle, drizzleState} = this.props;
   const contract = drizzle.contracts.DynamicProgPayETH;
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
  const { DynamicProgPayETH } = this.props.drizzleState.contracts;
  //console.log(drizzle);
  //console.log(drizzleState);
  console.log(drizzle.contracts.DynamicProgPayETH.address);
  let isPayer;
  let isPayee;
  const payee = DynamicProgPayETH.payee[this.props.indexes.payeeIndex];
  const payer = DynamicProgPayETH.payer[this.props.indexes.payerIndex];
  const nextPayment = DynamicProgPayETH.nextPayment['0x0'];

  //console.log(nextPayment && "NPI "+nextPayment.value);
  //console.log('2 '+payee.value);
  //console.log('2r '+payer.value);

  if (payer || payee){
    isPayer = this.props.drizzleState.accounts[0]===payer.value;
    isPayee = this.props.drizzleState.accounts[0]===payee.value;
    //console.log(isPayer?"Payer":isPayee?"Payee":"Neither Payer or Payee");
  }


let paymentDetails = {};
//console.log(this.state.paymentIndexes);
paymentDetails = this.state.paymentIndexes.map(x=>{
  let rObj = {};
  rObj['paymentValue'] = DynamicProgPayETH.paymentNumberToValue[x.paymentIndex];
  rObj['requested'] = DynamicProgPayETH.paymentNumberToRequested[x.requestedIndex];
  rObj['approved'] = DynamicProgPayETH.paymentNumberToApproved[x.approvedIndex];
  return rObj;
  //return {DynamicProgPayETH.paymentNumberToValue[x.paymentIndex],DynamicProgPayETH.paymentNumberToRequested[x.requestedIndex], DynamicProgPayETH.paymentNumberToApproved[x.approvedIndex]}
});

let statusReq = this.getStatusReq();
//console.log("SRQ "+statusReq);
let statusApp = this.getStatusApp();

console.log(paymentDetails);
let numPayments = this.props.numberOfPayments;
let contractVal = this.props.contractValue;

    return (

      <div>

                {paymentDetails.map(function(payment, index){
                    return (
                      <div key={index}>
                      <p key={index}>Payment #{index+1} in the amount of {parseFloat((web3.utils.fromWei((contractVal/numPayments).toString(), 'ether'))).toFixed(3)}Ξ
                     {payment.requested && (payment.requested.value===false?" has not been requested.   ": payment.approved && (payment.approved.value===true)?" has been requested and paid!":" has been requested and is awaiting approval/payment.   ")}

                    {
                      payee && isPayee===true && nextPayment && Number(nextPayment.value)===index+1 && payment.requested && payment.requested.value===false &&
                      <button className="btn btn-primary btn-sm" onClick={this.handleRequestPayment} disabled = {statusReq==="pending"?true:false}>{!statusReq?'Request':statusReq==="success"?'Success!':statusReq}</button>
                    }
                    {
                      payer && isPayer===true && nextPayment && Number(nextPayment.value)===index+1 && payment.requested && payment.requested.value===true &&
                      <button className="btn btn-primary btn-sm" onClick={this.handleApprovePayment} disabled = {statusApp==="pending"?true:false}>{!statusApp?'Approve':statusApp==="success"?'Success!':statusApp}</button>
                    }
                    </p>
                    </div>
                  )


                }, this)}
    </div>

    );
  }
}

export default ShowPaymentTable;
