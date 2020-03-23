
import React from "react";
import ShowPaymentTable from "./ShowPaymentTable";

import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

class GetContractInfo extends React.Component {

state = {};


 componentDidMount() {

    //access drizzle props within componentDidMount
    const { drizzle} = this.props;

    const contract = drizzle.contracts.ProgPayETH;

    var payeeIndex = contract.methods["payee"].cacheCall();
    var payerIndex = contract.methods["payer"].cacheCall();
    var contractValueIndex = contract.methods["contractValueInWei"].cacheCall();
    var numberOfPaymentsIndex = contract.methods["numberOfPayments"].cacheCall();
    var fundedIndex = contract.methods["contractFunded"].cacheCall();
    var nextPaymentIndex = contract.methods["nextPayment"].cacheCall();
    var remainingBalanceIndex = contract.methods["remainingBalance"].cacheCall();


    this.setState({payeeIndex, payerIndex, contractValueIndex, numberOfPaymentsIndex, fundedIndex, nextPaymentIndex, remainingBalanceIndex});

 }


render() {
  const { ProgPayETH } = this.props.drizzleState.contracts;
  //console.log(ProgPayETH);

  const payee = ProgPayETH.payee[this.state.payeeIndex];
  const payer = ProgPayETH.payer[this.state.payerIndex];
  const contractValue = ProgPayETH.contractValueInWei[this.state.contractValueIndex];
  const numberOfPayments = ProgPayETH.numberOfPayments[this.state.numberOfPaymentsIndex];
  const contractFunded = ProgPayETH.contractFunded[this.state.fundedIndex];
  const nextPayment = ProgPayETH.nextPayment[this.state.nextPaymentIndex];
  const remainingBalance = ProgPayETH.remainingBalance[this.state.remainingBalanceIndex];

  if (contractFunded){
    //console.log(contractFunded.value);
  }
  //console.log(payee);
    return (
      <div>
      <p>This Contract's Payer is {payer && payer.value} and the Payee is {payee && payee.value}.</p>
      <p>This contract is {contractFunded && (contractFunded.value===true?"":"NOT YET")} funded.</p>
      <p>The total value of this contract is {contractValue && (web3.utils.fromWei((contractValue.value).toString(), 'ether'))}Ξ to be paid over {numberOfPayments && numberOfPayments.value} payments.</p>
      <p>Remaining balance to be paid on this contract: {remainingBalance && (web3.utils.fromWei((remainingBalance.value).toString(), 'ether'))}Ξ.</p>
      <p>Next payment is number {nextPayment && nextPayment.value}.</p>
      {numberOfPayments &&
      <ShowPaymentTable
      drizzle={this.props.drizzle}
      drizzleState={this.props.drizzleState}
      numberOfPayments={numberOfPayments.value}
      />
    }
      </div>
    );
  }
}

export default GetContractInfo;
