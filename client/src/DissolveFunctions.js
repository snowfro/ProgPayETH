import React from "react";

import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

class DissolveFunctions extends React.Component {

  constructor(props){
    super(props);
    this.state ={};
    this.handleToggleDissolveStatus = this.handleToggleDissolveStatus.bind(this);
    this.handleDissolveContract = this.handleDissolveContract.bind(this);

  }


  componentDidMount() {

     const { drizzle } = this.props;
     const contract = drizzle.contracts.ProgPayETH;

     const payerDissolveIndex = contract.methods['payerWantsOut'].cacheCall();
     const payeeDissolveIndex = contract.methods['payeeWantsOut'].cacheCall();
     const timeRemainingIndex = contract.methods['timeRemaining'].cacheCall();

    this.setState({payerDissolveIndex, payeeDissolveIndex, timeRemainingIndex});
  }

  handleToggleDissolveStatus(){
    const { drizzleState } = this.props;
    const { ProgPayETH } = this.props.drizzle.contracts;
    const stackIdToggleDis = ProgPayETH.methods['toggleAgreeToDissolve'].cacheSend({from: drizzleState.accounts[0], value:0});
    this.setState({ stackIdToggleDis });
  }

  getStatusToggleDis(){
    const { transactions, transactionStack } = this.props.drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackIdToggleDis];
    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    if (transactions[txHash]){
    console.log(transactions[txHash].status);
    return transactions[txHash].status;
   }
  }

  handleDissolveContract(){
    const { drizzleState } = this.props;
    const { ProgPayETH } = this.props.drizzle.contracts;
    const stackIdDissolve = ProgPayETH.methods['dissolve'].cacheSend({from: drizzleState.accounts[0], value:0});
    this.setState({ stackIdDissolve });
  }

  getStatusDissolve(){
    const { transactions, transactionStack } = this.props.drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackIdDissolve];
    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    if (transactions[txHash]){
    console.log(transactions[txHash].status);
    return transactions[txHash].status;
   }
  }




  render(){

    const { drizzle, drizzleState } = this.props;
    const { ProgPayETH } = this.props.drizzleState.contracts;

    const payerDissolve = ProgPayETH.payerWantsOut[this.state.payerDissolveIndex];
    const payeeDissolve = ProgPayETH.payeeWantsOut[this.state.payeeDissolveIndex];

    let isPayer;
    let isPayee;

    const payee = ProgPayETH.payee[this.props.indexes.payeeIndex];
    const payer = ProgPayETH.payer[this.props.indexes.payerIndex];

    const timeRemaining = ProgPayETH.timeRemaining[this.state.timeRemainingIndex];

    if (payer || payee){
      isPayer = this.props.drizzleState.accounts[0]===payer.value;
      isPayee = this.props.drizzleState.accounts[0]===payee.value;
      console.log(isPayer?"Payer":isPayee?"Payee":"Neither Payer or Payee");
    }

    console.log(timeRemaining && "Time remaining: " + timeRemaining.value);

    let statusToggleDis = this.getStatusToggleDis();
    let statusDissolve = this.getStatusDissolve();

    return (

      <div>
      <br/>
      <br/>
      <hr/>
      <h4>Contract Dissolution</h4>

      {payer && isPayer===true &&
        <div>
        <p>You indicate that you {payerDissolve && payerDissolve.value===true?"want":"do not want"} to dissolve.  <button onClick={this.handleToggleDissolveStatus} disabled={statusToggleDis==="pending"?true:false}>{!statusToggleDis?'Switch':statusToggleDis==="success"?'Success! Switch Again':statusToggleDis}</button></p>
        <p>Payee {payeeDissolve && payeeDissolve.value===true?"wants":"does not want"} to dissolve.</p>
        </div>
      }

      {payer && isPayee===true &&
        <div>
        <p>You indicate that you {payeeDissolve && payeeDissolve.value===true?"want":"do not want"} to dissolve.  <button onClick={this.handleToggleDissolveStatus} disabled={statusToggleDis==="pending"?true:false}>{!statusToggleDis?'Switch':statusToggleDis==="success"?'Success! Switch Again':statusToggleDis}</button></p>
        <p>Payer {payerDissolve && payerDissolve.value===true?"wants":"does not want"} to dissolve.</p>
        </div>
      }

      {payerDissolve && payerDissolve.value===true && payeeDissolve && payeeDissolve.value===true &&
        <div>
        <p>Both parties have indicated that they want to dissolve this contract. Clicking "Dissolve" will immediately return any funds remaining in the contract to {payer && isPayer===true?"you":"the payer"} and this contract will terminate.</p>
        <button onClick={this.handleDissolveContract} disabled={statusDissolve==="pending"?true:false}>{!statusDissolve?'Dissolve':statusDissolve==="success"?'Success! Contract Dissolved':statusDissolve}</button>
        </div>
      }

      {((payerDissolve && payerDissolve.value===true) || (payeeDissolve && payeeDissolve.value===true)) &&
        <div>
        <p>When only one party wants to dissolve the contract there are three possible courses of action:</p>
        <ul>
          <li>Convince other party to agree to dissolve the contract.</li>
          <li>Trigger a cool down timer of 30 days after which either party can force the dissolution of the contract where the next payment is split between both parties after which the remaining funds are transferred to the payer.</li>
          <li>Agree to and set a mediator who will receive the funds and manage the distribution of funds outside of this contract.</li>
        </ul>
        <p>Any of the three above options will immediately terminate the contract and transfer all remaining funds to the designated recipient.</p>
        </div>
      }
      {timeRemaining && timeRemaining.value>0 && timeRemaining.value<100000000000000 &&
        <p>Force Dissolve has been triggered! This contract can be dissolved even when only one party wants to dissolve it in {timeRemaining && timeRemaining.value} seconds.
        Once the timer has expired either party can click the "Force Dissolve" button below to terminate the contract. This will split the last payment between the two parties and transfer remaining funds back to payer.</p>
      }
      </div>
    );
}
}



export default DissolveFunctions;
