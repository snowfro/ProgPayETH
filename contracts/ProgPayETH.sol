pragma solidity ^0.6.1;

// Add events!!!
// check if != address(0) works to see if address is null
// modify for DAI, USTC, USDT, etc
//check require added on "request payment" preventing requesting same payment twice
//remove selfDestruct so contract keeps info live/active


contract ProgPayETH {

    //payer is purchasing a service from payee

    address payable public payer;
    address payable public payee;

    //total value of the service contract spread over number of payments
    uint256 public contractValueInWei;
    uint256 public numberOfPayments;

    //parties signal desire to dissolve
    bool public payerWantsOut;
    bool public payeeWantsOut;

    //when only one party wants to dissolve start time set by forceDissolve() and delay (in seconds) set by constructor
    uint256 public forceDissolveStartTime;
    uint256 public forceDissolveDelay;

    //second option to dissolve by providing a mediator who will mediate fund distribution outside of contract. parties signal
    //their choice using setMediatorAddress() and they must match in order to enable dissolution
    address payable public payerMediatorAddress=0x0000000000000000000000000000000000000000;
    address payable public payeeMediatorAddress=0x0000000000000000000000000000000000000001;

    //has a payment number been requested?
    mapping(uint256 => bool) public paymentNumberToRequested;

    //has a payment number been approved? payment triggered automatically upon approval.
    mapping(uint256 => bool) public paymentNumberToApproved;

    //value of each payment (last payment might be larger based on quotient result)
    mapping(uint256 => uint256) public paymentNumberToValue;

    bool public contractFunded;
    uint256 public nextPayment;

    uint quotient;


    constructor(address payable _payer, address payable _payee, uint256 _contractValueInWei, uint256 _numberOfPayments, uint256 _forceDissolveDelay) public {
        payer = _payer;
        payee = _payee;
        contractValueInWei = _contractValueInWei;
        numberOfPayments = _numberOfPayments;

        //set first payment
        nextPayment=1;

        //preset dissolution variables here
        payeeWantsOut = false;
        payerWantsOut = false;
        forceDissolveStartTime = 0;
        forceDissolveDelay = _forceDissolveDelay;

        quotient = contractValueInWei/numberOfPayments;

        for (uint256 i=1;i<numberOfPayments+1;i++){
            paymentNumberToRequested[i]=false;
            paymentNumberToApproved[i]=false;

            paymentNumberToValue[i]=quotient;

        }
        paymentNumberToValue[numberOfPayments]+=contractValueInWei-quotient*numberOfPayments;
    }

    //payer desosits contract value here, triggering beginning of contract payment process. requires deposit amount to match contract value exactly
    function initialDeposit() public payable returns(bool) {
        require(msg.sender==payer);
        require(msg.value==contractValueInWei);
        require(contractFunded==false);
        contractFunded = true;
        return true;
    }

    //payee can request a payment only after contract is funded and not after all payments have been completed.
    function requestPayment() public returns(bool){
        require(contractFunded==true);
        require(msg.sender==payee);
        require(paymentNumberToRequested[nextPayment]==false);
        require(nextPayment != 0);
        paymentNumberToRequested[nextPayment]=true;
        return true;
    }

    //payer approves payment and initiates transaciton in the same transaction. payment must be requested by payee and contract must be funded.
    //payee received funds upon aproval
    function approvePayment() public returns(bool){
        uint256 amountToSend = paymentNumberToValue[nextPayment];
        require(contractFunded==true);
        require(msg.sender==payer);
        require(nextPayment != 0);
        require(paymentNumberToRequested[nextPayment]==true);
        paymentNumberToApproved[nextPayment]=true;
        paymentNumberToValue[nextPayment]=0;
        if(nextPayment<numberOfPayments){
            nextPayment++;
        } else {
            nextPayment=0;
        }
        payee.transfer(amountToSend);
        return true;
    }

    //allows each party to signal their interest to dissolve contract. contract must be funded
     function toggleAgreeToDissolve() public returns(bool){
        require(msg.sender==payer || msg.sender==payee);
        require(contractFunded==true);
        require(nextPayment != 0);
        if (msg.sender==payer){
            payerWantsOut = !payerWantsOut;
        } else {
            payeeWantsOut = !payeeWantsOut;
        }
        return true;
    }

    //if both payer and payee are in agreement to dissolve return balance of contract to payer
    function dissolve() public payable returns(bool){
        require(payeeWantsOut && payerWantsOut);
        contractFunded=false;
        selfdestruct(payer);
        return true;
    }

    //if only one party wants to dissolve can force a timer (in seconds, set at deployment) after which the contract can
    //be dissolved without both parties agreement where nextPayment is split between both parties --or-- both payer and payee
    //can signal for an agreed upon mediator to receive the funds who would then distribute them per a mediation agreement
    //outside of this contract.
    function forceDissolve() public payable returns(bool){
        require(payeeWantsOut || payerWantsOut);

        if (payerMediatorAddress == payeeMediatorAddress){
            selfdestruct(payerMediatorAddress);
        } else {
            if (forceDissolveStartTime == 0){
              forceDissolveStartTime = now;
            } else if (now > forceDissolveStartTime + forceDissolveDelay){
                uint256 splitPayment = paymentNumberToValue[nextPayment]/2;
                paymentNumberToValue[nextPayment]=0;
                payee.transfer(splitPayment);
                selfdestruct(payer);
            } else {
            return false;
            }
        }

        return true;
    }

    //if payer and payee find common ground and choose to continue with initial contract can reset the forceDissolve() timer
    //and keep going with initial agreement
    function resetForceDissolve() public returns(bool){
        require(!payeeWantsOut && !payerWantsOut);
        forceDissolveStartTime = 0;
        return true;
    }

    //payer and payee can confirm agreement to mediation by providing the same mediator address
    function setMediatorAddress(address payable _mediatorAddress) public returns(bool){
        require(msg.sender==payer || msg.sender==payee);
        if (msg.sender==payer){
            payerMediatorAddress = _mediatorAddress;
        } else {
            payeeMediatorAddress = _mediatorAddress;
        }
        return true;
    }

    //returns time remaining until forceDissolve() will split nextPayment and destroy contract
    function timeRemaining() public view returns(uint256){
        if (forceDissolveStartTime > 0){
        return forceDissolveStartTime + forceDissolveDelay - now;
        } else {
            return 0;
        }
    }

    //returns remaining balance, used while testing in JavaScript VM mode can be removed for mainnet as contract
    //balance appears on Etherscan
    function remainingBalance() public view returns(uint256){
        return address(this).balance;
    }



}


//    "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C","1000000000000000000","9","180"
