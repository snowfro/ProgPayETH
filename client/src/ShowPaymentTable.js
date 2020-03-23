
import React from "react";

import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

class ShowPaymentTable extends React.Component {

state = {paymentIndexes:[]};


 componentDidMount() {

    const { drizzle } = this.props;
    const contract = drizzle.contracts.ProgPayETH;
    let paymentIndexes = [];

    for (let i=0; i<this.props.numberOfPayments; i++){
      const paymentIndex = contract.methods["paymentNumberToValue"].cacheCall(i+1);
      const requestedIndex = contract.methods["paymentNumberToRequested"].cacheCall(i+1);
      const approvedIndex = contract.methods["paymentNumberToApproved"].cacheCall(i+1);
      paymentIndexes.push({paymentIndex, requestedIndex, approvedIndex});
    }

    this.setState({paymentIndexes});

 }


render() {

const { ProgPayETH } = this.props.drizzleState.contracts;
let paymentDetails = {};
//console.log(this.state.paymentIndexes);
paymentDetails = this.state.paymentIndexes.map(x=>{
  let rObj = {};
  rObj['paymentValue'] = ProgPayETH.paymentNumberToValue[x.paymentIndex];
  rObj['requested'] = ProgPayETH.paymentNumberToRequested[x.requestedIndex];
  rObj['approved'] = ProgPayETH.paymentNumberToApproved[x.approvedIndex];
  return rObj;
  //return {ProgPayETH.paymentNumberToValue[x.paymentIndex],ProgPayETH.paymentNumberToRequested[x.requestedIndex], ProgPayETH.paymentNumberToApproved[x.approvedIndex]}
});
console.log(paymentDetails);

    return (

      <div>
                {paymentDetails.map(function(payment, index){
                    return <p key={index}>Payment #{index+1} in the amount of {payment.paymentValue && parseFloat((web3.utils.fromWei((payment.paymentValue.value).toString(), 'ether'))).toFixed(3)}Ξ
                     {payment.requested && (payment.requested.value===false?" has not been requested.": payment.approved && (payment.approved.value===true)?" has been requested and paid!":" has been requested and is awaiting approval/payment.")} {}</p>;
                  })}
    </div>

    );
  }
}

export default ShowPaymentTable;
