import React from "react";

class DissolveFunctions extends React.Component {

  constructor(props){
    super(props);
    this.state ={mediatorAddress:null};
    this.handleToggleDissolveStatus = this.handleToggleDissolveStatus.bind(this);
    this.handleDissolveContract = this.handleDissolveContract.bind(this);
    this.handleSetMediatorAddress = this.handleSetMediatorAddress.bind(this);
    this.handleForceDissolveContract = this.handleForceDissolveContract.bind(this);
    this.handleForceDissolveContract2 = this.handleForceDissolveContract2.bind(this);
    this.handleResetDissolveContractTimer = this.handleResetDissolveContractTimer.bind(this);

  }


  componentDidMount() {

     const { drizzle } = this.props;
     const contract = drizzle.contracts[this.props.contractId];

     const payerDissolveIndex = contract.methods['payerWantsOut'].cacheCall();
     const payeeDissolveIndex = contract.methods['payeeWantsOut'].cacheCall();

     const timeRemainingIndex = contract.methods['timeRemaining'].cacheCall();

     const forceDissolveStartTimeIndex = contract.methods['forceDissolveStartTime'].cacheCall();
     const forceDissolveDelayIndex = contract.methods['forceDissolveDelay'].cacheCall();

     const payerMediatorAddressIndex = contract.methods['payerMediatorAddress'].cacheCall();
     const payeeMediatorAddressIndex = contract.methods['payeeMediatorAddress'].cacheCall();

     const nextPaymentRequestedIndex = contract.methods['paymentNumberToRequested'].cacheCall(this.props.nextPayment);



    this.setState({payerDissolveIndex, payeeDissolveIndex, timeRemainingIndex, forceDissolveStartTimeIndex, forceDissolveDelayIndex, payerMediatorAddressIndex, payeeMediatorAddressIndex, nextPaymentRequestedIndex});
  }

  handleToggleDissolveStatus(){
    const { drizzleState } = this.props;
    const contract = this.props.drizzle.contracts[this.props.contractId];
    const stackIdToggleDis = contract.methods['toggleAgreeToDissolve'].cacheSend({from: drizzleState.accounts[0], value:0});
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

  handleSetMediatorAddress(){
    const { drizzleState } = this.props;
    const contract = this.props.drizzle.contracts[this.props.contractId];
    const stackIdSetMediator = contract.methods['setMediatorAddress'].cacheSend(this.state.mediatorAddress,{from: drizzleState.accounts[0], value:0});
    this.setState({ stackIdSetMediator });
  }

  getStatusSetMediator(){
    const { transactions, transactionStack } = this.props.drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackIdSetMediator];
    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    if (transactions[txHash]){
    console.log(transactions[txHash].status);
    return transactions[txHash].status;
   }
  }

  handleChangeMediatorAddressInput(event){
    this.setState({mediatorAddress:event.target.value})
    console.log(this.state.mediatorAddress);
  }

  handleDissolveContract(){
    const { drizzleState } = this.props;
    const contract = this.props.drizzle.contracts[this.props.contractId];
    const stackIdDissolve = contract.methods['dissolve'].cacheSend({from: drizzleState.accounts[0], value:0});
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

  handleForceDissolveContract(){
    const { drizzleState } = this.props;
    const contract = this.props.drizzle.contracts[this.props.contractId];
    const stackIdForceDissolve = contract.methods['forceDissolve'].cacheSend({from: drizzleState.accounts[0], value:0});
    this.setState({ stackIdForceDissolve });
  }

  getStatusForceDissolve(){
    const { transactions, transactionStack } = this.props.drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackIdForceDissolve];
    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    if (transactions[txHash]){
    console.log(transactions[txHash].status);
    return transactions[txHash].status;
   }
  }

  //using same contract call with different event handlers to receive different status for each

  handleForceDissolveContract2(){
    const { drizzleState } = this.props;
    const contract = this.props.drizzle.contracts[this.props.contractId];
    const stackIdForceDissolve2 = contract.methods['forceDissolve'].cacheSend({from: drizzleState.accounts[0], value:0});
    this.setState({ stackIdForceDissolve2 });
  }

  getStatusForceDissolve2(){
    const { transactions, transactionStack } = this.props.drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackIdForceDissolve2];
    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    if (transactions[txHash]){
    console.log(transactions[txHash].status);
    return transactions[txHash].status;
   }
  }

  handleResetDissolveContractTimer(){
    const { drizzleState } = this.props;
    const contract = this.props.drizzle.contracts[this.props.contractId];
    const stackIdresetForceDissolve = contract.methods['resetForceDissolve'].cacheSend({from: drizzleState.accounts[0], value:0});
    this.setState({ stackIdresetForceDissolve });
  }

  getStatusDissolveResetTimer(){
    const { transactions, transactionStack } = this.props.drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackIdresetForceDissolve];
    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    if (transactions[txHash]){
    console.log(transactions[txHash].status);
    return transactions[txHash].status;
   }
  }



  render(){


    const contract = this.props.drizzleState.contracts[this.props.contractId];

    const payerDissolve = contract.payerWantsOut[this.state.payerDissolveIndex];
    const payeeDissolve = contract.payeeWantsOut[this.state.payeeDissolveIndex];
    const forceDissolveStartTime = contract.forceDissolveStartTime[this.state.forceDissolveStartTimeIndex];
    const forceDissolveDelay = contract.forceDissolveDelay[this.state.forceDissolveDelayIndex];

    const payerMediatorAddress = contract.payerMediatorAddress[this.state.payerMediatorAddressIndex];
    const payeeMediatorAddress = contract.payeeMediatorAddress[this.state.payeeMediatorAddressIndex];

    const nextPaymentRequested = contract.paymentNumberToRequested[this.state.nextPaymentRequestedIndex];

    let mediatorAddressesMatchButNot0x0;
    if (payerMediatorAddress && payeeMediatorAddress){

    mediatorAddressesMatchButNot0x0 = payerMediatorAddress.value===payeeMediatorAddress.value && payerMediatorAddress.value !== "0x0000000000000000000000000000000000000000" && payeeMediatorAddress.value !== "0x0000000000000000000000000000000000000000";
    console.log("MatchButNot0x0 "+mediatorAddressesMatchButNot0x0);
    }

    let payerMediatorSentence = (payerMediatorAddress && " You've set your mediator address to "+payerMediatorAddress.value+". ");
    let payeeMediatorSentence = (payeeMediatorAddress && " You've set your mediator address to "+payeeMediatorAddress.value+". ");
    console.log(payerMediatorAddress && "PrMA "+payerMediatorAddress.value);
    console.log(payeeMediatorAddress && "PeMA "+payeeMediatorAddress.value);

    let timerExpiresDate;
    if (forceDissolveStartTime && forceDissolveDelay){
      console.log("Start "+ forceDissolveStartTime.value);
      console.log("Delay "+ forceDissolveDelay.value);
      let timerExpires = Number(forceDissolveStartTime.value) + Number(forceDissolveDelay.value);
      console.log("total "+ timerExpires);
      timerExpiresDate = new Date(timerExpires*1000).toString();
      console.log("exp "+timerExpiresDate);
    }


    let isPayer;
    let isPayee;

    const payee = contract.payee[this.props.indexes.payeeIndex];
    const payer = contract.payer[this.props.indexes.payerIndex];

    const timeRemaining = contract.timeRemaining[this.state.timeRemainingIndex];

    if (payer || payee){
      isPayer = this.props.drizzleState.accounts[0]===payer.value;
      isPayee = this.props.drizzleState.accounts[0]===payee.value;
      console.log(isPayer?"Payer":isPayee?"Payee":"Neither Payer or Payee");
    }

    console.log(timeRemaining && "Time remaining: " + timeRemaining.value);

    let statusToggleDis = this.getStatusToggleDis();
    let statusDissolve = this.getStatusDissolve();
    let statusSetMediator = this.getStatusSetMediator();
    let statusForceDissolve = this.getStatusForceDissolve();
    let statusForceDissolve2 = this.getStatusForceDissolve2();
    let statusDissolveResetTimer = this.getStatusDissolveResetTimer();

    return (

      <div>
      <br/>
      <br/>
      <hr/>
      <div className="container">
      <h4>Contract Dissolution</h4>

      {payer && isPayer===true &&
        <div>
        <p>You indicate that you {payerDissolve && payerDissolve.value===true?"want":"do not want"} to dissolve. Click "switch" to change your position.  <button className="btn btn-sm btn-primary" onClick={this.handleToggleDissolveStatus} disabled={statusToggleDis==="pending"?true:false}>{!statusToggleDis?'Switch':statusToggleDis==="success"?'Switch':statusToggleDis}</button></p>
        <p>Payee {payeeDissolve && payeeDissolve.value===true?"has moved":"has not moved"} to dissolve.</p>
        </div>
      }

      {payee && isPayee===true &&
        <div>
        <p>You indicate that you {payeeDissolve && payeeDissolve.value===true?"want":"do not want"} to dissolve. Click "switch" to change your position.  <button className="btn btn-sm btn-primary" onClick={this.handleToggleDissolveStatus} disabled={statusToggleDis==="pending"?true:(nextPaymentRequested && nextPaymentRequested.value===true && payerDissolve && payerDissolve.value===false)?true:false}>{!statusToggleDis?'Switch':statusToggleDis==="success"?'Success! Switch Again':statusToggleDis}
        </button></p>
        {nextPaymentRequested && nextPaymentRequested.value===true &&
        <p>Note: You cannot move to dissolve if you've already requested the next payment unless the payer has indicated they want to dissolve first.</p>}
        <p>Payer {payerDissolve && payerDissolve.value===true?"has moved":"has not moved"} to dissolve.</p>
        </div>
      }
      { timeRemaining && timeRemaining.value>0 && payerDissolve && payerDissolve.value===false && payeeDissolve && payeeDissolve.value===false &&
        <button className="btn btn-sm btn-primary" onClick={this.handleResetDissolveContractTimer} disabled={statusDissolveResetTimer==="pending"?true:false}>{!statusDissolveResetTimer?'Disarm Timer':statusDissolveResetTimer==="success"?'Success! Timer Disarmed':statusDissolveResetTimer}</button>
      }

      {payerDissolve && payerDissolve.value===true && payeeDissolve && payeeDissolve.value===true &&
        <div>
        <p>Both parties have indicated that they want to dissolve this contract {nextPaymentRequested && nextPaymentRequested.value===true?"and the next payment has been requested":""}. Clicking "Dissolve" will immediately {nextPaymentRequested && nextPaymentRequested.value===true?"transfer the next payment to the payee and the remaining funds to the payer":"return all remaining funds in the contract to the payer"} and this contract will terminate.</p>
        <button className="btn shadow-lg btn-danger btn-sm btn-block" onClick={this.handleDissolveContract} disabled={statusDissolve==="pending"?true:false}>{!statusDissolve?'Force Dissolve':statusDissolve==="success"?'Success! Contract Dissolved':statusDissolve}</button>
        </div>
      }

      {((payerDissolve && payerDissolve.value===true) || (payeeDissolve && payeeDissolve.value===true)) &&
        <div>
        <p>When only one party wants to dissolve the contract there are three possible courses of action:</p>
        <ul>
          <li>Convince other party to agree to dissolve the contract.</li>
          <li>
          <p>Trigger a cool down timer of {forceDissolveDelay && Number(forceDissolveDelay.value/60/60/24).toFixed(0)} days after which either party can force the dissolution of the contract. If the contract is dissolved using this method the next payment will be split between both parties and the remaining funds transferred to the payer.
          <button className="btn btn-sm btn-danger" onClick={this.handleForceDissolveContract} disabled={statusForceDissolve==="pending"?true:(timeRemaining && timeRemaining.value>0)?true:(payee && isPayee==="true" && nextPaymentRequested && nextPaymentRequested.value===true)?true:false}>{!statusForceDissolve?'Force Dissolve by Timer':statusForceDissolve==="success"?'Success! Timer Started':statusForceDissolve}</button></p>
          {nextPaymentRequested && nextPaymentRequested.value===true &&
          <p>Note: You cannot force dissolve if you've already requested the next payment.</p>}
          <p>***The timer can be disabled, even after expiration, if both payer and payee indicate that they want to dissolve the contract.</p>

          </li>
          <li>Agree to and set a mediator that will receive all remaining contract funds and manage their distribution outside of this contract.
          {payer && isPayer===true &&
            (payerMediatorAddress && payerMediatorAddress.value==="0x0000000000000000000000000000000000000000"?" You have not set a mediator address. ":<i>{payerMediatorSentence}</i>)}

          {payer && isPayee===true &&
              (payeeMediatorAddress && payeeMediatorAddress.value==="0x0000000000000000000000000000000000000000"?" You have not set a mediator address. ":<i>{payeeMediatorSentence}</i>)}
              If both parties have designated the same mediator address a button allowing either party to force dissolve the contract to a mediator will appear below.
              <br/>
              <input type="text" placeholder="0x....." className="form-control" aria-label="Contact Method" aria-describedby="contact-method" onChange={this.handleChangeMediatorAddressInput.bind(this)}/>
              <button className="btn btn-sm btn-warning" onClick={this.handleSetMediatorAddress} disabled={statusSetMediator==="pending"?true:false}>{!statusSetMediator?'Set New Mediator Address':statusSetMediator==="success"?'Success!':statusSetMediator}</button>
              <br/>
              {mediatorAddressesMatchButNot0x0 &&
                <button className="btn btn-sm btn-warning" onClick={this.handleForceDissolveContract2} disabled={statusForceDissolve2==="pending"?true:!mediatorAddressesMatchButNot0x0?true:false}>{!statusForceDissolve2&&!mediatorAddressesMatchButNot0x0?'Cannot Dissolve Mediator Addresses Must Match':!statusForceDissolve2&&mediatorAddressesMatchButNot0x0?'Force Dissolve to Mediator':statusForceDissolve2==="success"?'Success! Contract Dissolved':statusForceDissolve2}</button>
              }
            </li>
        </ul>
        <p>Any of the three above options will immediately terminate the contract and transfer all remaining funds to the designated recipient.</p>
        </div>
      }
      {timeRemaining && timeRemaining.value>0 &&
        <div>
        <p>The timer to force dissolution of this contract has been triggered! This contract can be dissolved (even if only one party wants to dissolve it) after {timerExpiresDate}.
        Once the timer has expired either party can click the "Force Dissolve" button that will appear below to terminate the contract. This will split the last payment between the two parties and transfer remaining funds back to payer.</p>
        <p>Note: Timer can be disarmed by clicking the "Disarm Timer" button above. <b>The button will ONLY appear if both parties indicate they <i>do not</i> want to dissolve.</b></p>
        {timeRemaining && timeRemaining.value>100000000000000 &&
          <button className="btn shadow-lg btn-danger btn-sm btn-block"onClick={this.handleForceDissolveContract} disabled={statusForceDissolve==="pending"?true:false}>{!statusForceDissolve?'Force Dissolve':statusForceDissolve==="success"?'Success! Contract Dissolved':statusForceDissolve}</button>
        }
        </div>
      }
      </div>
      </div>
    );
}
}



export default DissolveFunctions;
