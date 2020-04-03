import React from 'react';

class HowItWorks extends React.Component {

render(){
  return (
    <div className="container">
    <br/>
    <h3>DecentPay Payment Contracts</h3>
    <br/>
    <div className="border border-secondary shadow rounded" style={{padding: 12, backgroundColor:'AliceBlue'}}>
    <h5>Introduction</h5>
    <p>This utility allows for two parties to enter into a transparent multi-payment agreement using either ETH or DAI. There are no constraints on the contract's value or number of payments. Each agreement is an
    individually deployed smart contract on the Ethereum blockchain and exclusively controlled and managed by the two paying parties involved. </p>
    <p>The parameters of the agreement are set when the contract is initiated. The main difference between a legacy paper contract and a DecentPay payment contract is that DecentPay contracts are controlled by code, and
    cannot be manipulated once deployed. In addition, there are no legal fees involved in initiating a DecentPay payment agreement.</p>
    <p>When work is promised in exchange for payment between two parties, especially those that do not know each other, a decentralized payment contract can ease concerns and build trust. The person doing the work, the <i>payee</i>,
    can see that the <i>payer</i> not only posseses the funds to complete the entire contract, but is willing to lock the funds into the contract as a measure of good faith. The goal is to eliminate uncertainty,
    delays, and fees involved in traditional payment systems.</p>
    <p>Additional mechanics built into the contracts provide a way for the parties to dissolve the agreement in case things are not going as planned. The dissolve functions allow the <i>payer</i> to recover funds while giving the <i>payee</i> an opportunity to
    be paid for completed work. In these contracts a worst case scenario is that the next payment is split between both parties, and the balance returned to the <i>payer</i>. This, of course, is assuming that the <i>payee</i> is keeping up with payment requests and not proceeding with new work until paid for the previous milestone.</p>
    </div>
    <br/>
    <br/>
    <div className="border border-secondary shadow rounded" style={{padding: 12, backgroundColor:'AliceBlue'}}>
    <h5>Instructions</h5>

    <p>First, <i>payer</i> and <i>payee</i> must agree to some basic contract parameters: total value of the contract, total number of (equal) payments, and a cooldown timer, in days, that will be implemented before one party can dissolve the contract by force (more on this below).</p>
    <p>Next, the contract is deployed. Anyone can deploy the contract as long as they know the contract paramters and the Ethereum addresses of the <i>payer</i> and <i>payee</i>. Note that the person deploying the contract inherits <b>no control</b> over the
    contract unless the contract is deployed by the <i>payer</i> or the <i>payee</i>. </p>
    <p>Once the payment contract is deployed, the paying party must first pre-deposit the full value of promised work into the contract. </p>
    <p>Finally, when a contract is funded and active, a list of each payment will appear on the dashboard. Both parties can sequentially request and approve payments as working progress is made. First the <i>payee</i> will see a "request" button on the right hand side of the payment list. Once that payment is requested, the <i>payer</i> will then see a button on the right side of the payment
    list that says "approve". When the payment is approved, the funds for that payment are transferred to the <i>payee</i>. This will continue for the total number of payments until the remaining balance of the contract is depleted and the <i>payee </i>
     receives the full contract funds. A payment that has not yet been requested will be listed in blue. Once requested but not approved it will change to yellow, and then after it is approved the payment will change to green.</p>
    <h6>All contract functions are available through the contract dashboard which will be presented once the contract is deployed.</h6>
    <p>Ready? Scroll up and input the contract parameters above, select your currency, and click "Deploy Contract". Note: you must be connected to Ethereum through a web3 provider like <a href="https://metamask.io" target="_blank" rel="noreferrer noopener">MetaMask</a> in order to deploy the contract.</p>
    </div>
    <br/>
    <br/>

    <div className="border border-secondary shadow rounded" style={{padding: 12, backgroundColor:'AliceBlue'}}>
    <h5>Protections</h5>
    <br/>
    <p> DecentPay decentralized contracts protect both the <i>payer</i> and the <i>payee</i>.</p>
    <div className="container">
    <ul className="list-group">

    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>The <i>payer</i> is able to release payments in multiple draws based on milestone completion on the part of the <i>payee</i>.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>The <i>payee</i> is able to validate availability of the funds throughout the entire process and can be paid without delays or fees.</li>
    </ul>
    <br/>
    </div>
    </div>
    <br/>
    <br/>

    <div className="border border-secondary shadow rounded" style={{padding: 12, backgroundColor:'AliceBlue'}}>
    <h5>Dissolving a Contract</h5>
    <br/>
    <p>In case a payment agreement becomes problematic, there are various options for payer and payee to dissolve the contract, based on rules implemented into the platform, that help
    protect both the <i>payer</i> and the <i>payee</i>.</p>

    <p>If <b>both</b> parties are unhappy with the contract and want to withdraw they can "move to dissolve" the contract. The contract can then be immediately dissolved as long as <b>both parties</b> have indicated they want to dissolve the contract. </p>
    <div className="container">
    <ul className="list-group">
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>If the next payment has not yet been requested by the <i>payee</i>, the <i>payer</i> receives the full remaining value of the contract. </li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>If the <i>payee</i> has already requested the next payment and both parties agree to dissolve, the <i>payee</i> receives the next payment and then the <i>payer</i> is sent the remaining funds held in the contract.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>To protect the <i>payer</i>, the <i>payee</i> is restricted from requesting the next payment if he/she has already moved to dissolve the contract.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>The <i>payee</i> is restricted from moving to dissolve a contract if he/she has already requested the next payment unless the <i>payer</i> has moved to dissolve the contract first.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>If both <i>payer</i> and <i>payee</i> have both moved to dissolve a button will appear in the dissolve functions menu allowing either one to dissolve the contract immediately.</li>

    </ul>
    <br/>
    </div>
    <br/>
    <p>If only <b>one party</b> wants to dissolve the contract they have three options:</p>
    <div className="container">
    <ul className="list-group">
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>Convince other party to accept dissolution of the contract by "moving to dissolve" per above.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>Force dissolution of the contract by initiating a "cool down" timer (set during contract deployment) which once expired allows either party to immediately force the dissolution of the contract.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>Appoint a mediator to receive all funds and manage the distribution of funds externally.</li>

    </ul>
    <br/>
    </div>
    <br/>
    <h6>Cooldown Timer</h6>
    <p>One party can force the termination of the contract by activating a cooldown timer. Once the timer expires the contract can be terminated and funds can be receovered.</p>
    <div className="container">
    <ul className="list-group">
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>The timer encourages both parties to come to an agreement and continue the contract, while preventing the <i>payee</i> from locking the <i>payer's</i> funds up indefinitely.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>While the timer is active the request and approve functions of the contract are still available.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>The timer is set by number of days. The "dissolve menu" on the contract dashboard will indicate when the timer will expire. Once the timer has expired a button will appear in the "dissolve menu" allowing the contract to be forcefully dissolved.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>Any contract forcefully dissolved will <b>split the next payment</b> between the payer and the payee, and send remaining balance back to the payer.</li>
    </ul>
    <br/>
    </div>
    <br/>
    <h6>Mediation</h6>
    <p>Parties can assign a mediator to distirbute remaining funds.</p>
    <div className="container">
    <ul className="list-group">
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>A mediator is a third party person or entity that is willing to help <i>payer</i> and <i>payee</i> come to an agreement and handle funds distribution outside of the paramters of the initial contract.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>In order to dissolve the contract through a mediator both <i>payer</i> and <i>payee</i> must set a mediator address and both mediator addresses <b>must match</b>.</li>
    <li className="list-group-item" style={{backgroundColor:"GhostWhite"}}>Upon successfully dissolving the contract in this manner the mediator is sent all remaining contract funds immediately and the original payment contract is terminated.</li>
    </ul>
    <br />
    </div>
    </div>





    <div>
    <br/>
    <br/>

    <div className="alert alert-danger shadow" role="alert">
    <h5 className="alert-heading">NOTICE: Each payment contract is a fully autonomous and independent smart contract on the Ethereum blockchain.</h5>
    <hr/>
    <ul>
    <li><small className="text-muted">DecentPay has no control or jurisdiction over the smart contract once deployed.</small></li>
    <li><small className="text-muted">Contract functions controlled entirely by <i>payer</i> and <i>payee</i>.</small></li>
    <li><small className="text-muted">This utility is provided free of charge. Do your own research before sending any funds.</small></li>
    <li><small className="text-muted">Ensure that you are connected to this site with a secure connection and the lock icon is displayed next to the URL in your browser.</small></li>
    <li><small className="text-muted">If your address bar says anything other than decentpay.app you are at risk of losing funds.</small></li>
    </ul>
    </div>

    <br/>
    </div>
    </div>
  )
}
}

export default HowItWorks;
