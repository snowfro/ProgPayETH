pragma solidity ^0.5.9;

interface DAITokenInterface {
    function balanceOf(address owner) external view returns(uint256 balance);
    function allowance(address owner, address spender) external view returns(uint256 spendingAllowance);
    function transferFrom(address _from, address _to, uint256 _amount) external returns(bool);
    function transfer(address _to, uint256 _value) external returns(bool);
}


pragma solidity ^0.5.9;

// Add events!!!
// modify for DAI, USTC, USDT, etc
// check forceDissolve() reentrancy vulnerability


contract ProgPayDAI {
    
    DAITokenInterface public daiContract;

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
    
    address payable public payerMediatorAddress;
    address payable public payeeMediatorAddress;

    //has a payment number been requested?
    mapping(uint256 => bool) public paymentNumberToRequested;

    //has a payment number been approved? payment triggered automatically upon approval.
    mapping(uint256 => bool) public paymentNumberToApproved;

    //value of each payment (last payment might be larger based on quotient result)
    mapping(uint256 => uint256) public paymentNumberToValue;
    
    bool public contractFunded;
    bool public contractTerminated;
    uint256 public nextPayment;
    
    string public contractName = "DecentPay DAI";

    uint quotient;


    constructor(address payable _payer, address payable _payee, uint256 _contractValueInWei, uint256 _numberOfPayments, uint256 _forceDissolveDelay, address _DAIContract) public {
        
        daiContract = DAITokenInterface(_DAIContract);
        
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

    //payer desosits contract value here, triggering beginning of contract payment process. requires deposit amount to match contract value exactly.
    //must authorize the transfer on the DAI contract first
    function initialDeposit() public payable returns(bool) {
        require(msg.sender==payer, "you must be payer");
        require(daiContract.balanceOf(payer)>=contractValueInWei, "payer must have sufficient DAI in account to cover contract value");
        require(daiContract.allowance(payer, address(this))>=contractValueInWei, "allowance must be higher than contract value");
        require(!contractFunded, "contact must not have been previously funded");
        require(!contractTerminated, "contract must be active");
        daiContract.transferFrom(payer, address(this), contractValueInWei);
        contractFunded = true;
        return true;
    }

    //payee can request a payment only after contract is funded and not after all payments have been completed.
    function requestPayment() public returns(bool){
        require(!payeeWantsOut, "Payee must not flag to dissolve.");
        require(!contractTerminated, "Contract must be active.");
        require(contractFunded, "Contract must be funded");
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
        require(!contractTerminated, "Contract must be active");
        require(contractFunded, "Contract must be funded");
        require(msg.sender==payer, "Only payer can approve payment");
        require(nextPayment != 0);
        require(paymentNumberToRequested[nextPayment], "Payment must be requested first");
        paymentNumberToApproved[nextPayment]=true;
        paymentNumberToValue[nextPayment]=0;
        if(nextPayment<numberOfPayments){
            nextPayment++;
        } else {
            contractFunded=false;
            contractTerminated=true;
            nextPayment=0;
        }
        bool transferred = daiContract.transfer(payee, amountToSend);
        return transferred;
    }

   

    //if both payer and payee are in agreement to dissolve return balance of contract to payer
    function dissolve() public payable returns(bool){
        require(!contractTerminated);
        require(payeeWantsOut && payerWantsOut);
        require(msg.sender==payer || msg.sender==payee);
        require(forceDissolveStartTime==0);
        
        if (paymentNumberToRequested[nextPayment]){
            uint256 contractBalanceRemaining = daiContract.balanceOf(address(this));
            uint256 finalPayment = paymentNumberToValue[nextPayment];
            uint256 balanceReturnToPayer = contractBalanceRemaining - finalPayment;
            contractFunded=false;
            contractTerminated=true;
            nextPayment=0;
            paymentNumberToValue[nextPayment]=0;
            daiContract.transfer(payee, finalPayment);
            daiContract.transfer(payer, balanceReturnToPayer);
        } else {
            contractFunded=false;
            contractTerminated=true;
            nextPayment=0;
            daiContract.transfer(payer, daiContract.balanceOf(address(this)));
        }
        
        return true;
        
}

    //if only one party wants to dissolve can force a timer (in seconds, set at deployment) after which the contract can
    //be dissolved without both parties agreement where nextPayment is split between both parties --or-- both payer and payee
    //can signal for an agreed upon mediator to receive the funds who would then distribute them per a mediation agreement
    //outside of this contract.
    
    function forceDissolve() public payable returns(bool){
        require(!contractTerminated);
        //require(payeeWantsOut || payerWantsOut);
        if(paymentNumberToRequested[nextPayment]){
            require(msg.sender==payer || (msg.sender==payee && payerMediatorAddress != address(0) && payeeMediatorAddress != address(0) && payerMediatorAddress == payeeMediatorAddress));
        }else {
            require(msg.sender==payer || msg.sender==payee);
        }
        
        if (payerMediatorAddress != address(0) && payeeMediatorAddress != address(0) && payerMediatorAddress == payeeMediatorAddress){
            uint256 contractBalanceRemaining = daiContract.balanceOf(address(this));
            contractFunded=false;
            contractTerminated=true;
            nextPayment=0;
            daiContract.transfer(payerMediatorAddress, contractBalanceRemaining);
        } else {
            if (forceDissolveStartTime == 0){
              forceDissolveStartTime = now;
            } else if (now > forceDissolveStartTime + forceDissolveDelay){
                uint256 contractBalanceRemaining = daiContract.balanceOf(address(this));
                uint256 splitLastPayment = paymentNumberToValue[nextPayment]/2;
                uint256 balanceReturnToPayer = contractBalanceRemaining-splitLastPayment;
                paymentNumberToValue[nextPayment]=0;
                nextPayment=0;
                contractFunded=false;
                contractTerminated=true;
                daiContract.transfer(payee, splitLastPayment);
                daiContract.transfer(payer, balanceReturnToPayer);
            } else {
            return false;
            }
        }

        return true;
    }
    
    
     //allows each party to signal their interest to dissolve contract. contract must be funded
     function toggleAgreeToDissolve() public returns(bool){
        require(!contractTerminated);
        require(msg.sender==payer || msg.sender==payee);
        require(contractFunded);
        require(nextPayment != 0);
        if (msg.sender==payer){
            payerWantsOut = !payerWantsOut;
        } else {
            if (paymentNumberToRequested[nextPayment]==true){
                if(payerWantsOut){
                    payeeWantsOut = !payeeWantsOut;
                } else {
                    return false;
                }
            } else {
                payeeWantsOut = !payeeWantsOut;
            }
        }
        return true;
    }
     
    //if payer and payee find common ground and choose to continue with initial contract can reset the forceDissolve() timer
    //and keep going with initial agreement
    function resetForceDissolve() public returns(bool){
        require(!payeeWantsOut && !payerWantsOut);
        require(msg.sender==payer || msg.sender==payee);
        forceDissolveStartTime = 0;
        return true;
    }

    //payer and payee can confirm agreement to mediation by providing the same mediator address
    function setMediatorAddress(address payable _mediatorAddress) public returns(bool){
        require(!contractTerminated);
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
        return daiContract.balanceOf(address(this));
    }
    
    //returns true is payer has allowed this contract to transfer the value of this contract worth of DAI on his/her behalf
    function approvedToTransfer() public view returns(bool){
        bool approved =  daiContract.allowance(payer, address(this))>=contractValueInWei && daiContract.balanceOf(payer)>=contractValueInWei;
        return approved;
    }


}


//    "0xf3860788D1597cecF938424bAABe976FaC87dC26","0x5462deE16b3f4D240EBBE52C9C4214c912ccDda4","11000000000000000000","6","300"
