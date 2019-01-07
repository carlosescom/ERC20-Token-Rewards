import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'

// Components
import { ContractForm } from 'drizzle-react-components'
import BalanceRange from '../components/BalanceRange.js'
import Balance from '../components/Balance.js'

import logo from '../../logo.png'

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      accounts: props.drizzleState.accounts,
      accountsToRetrieve: 4,
      currentAccount: null,
      drizzle: props.drizzle,
      drizzleState: props.drizzleState,
      index: 0,
      initialized: false
    }
    this.changeIndex = this.changeIndex.bind(this)
  }
  
  componentDidMount() {
    var thisComponent = this
    var drizzle = this.props.drizzle
    var drizzleState = drizzle.store.getState()
    drizzle.store.subscribe(function () {
      drizzle = thisComponent.props.drizzle
      drizzleState = drizzle.store.getState()
      if (drizzleState.drizzleStatus.initialized) {
        thisComponent.setState(prevState => {
          return {
            ...prevState,
            accounts: drizzleState.accounts,
            currentAccount: drizzleState.accounts[prevState.index],
            drizzleState: drizzleState,
            initialized: true
          }
        })
      }
    })
  }

  changeIndex(event) {
    event.persist()
    if(0 <= event.target.value && event.target.value < 10)
      this.setState(prevState => {
        return {
          ...prevState,
          index: event.target.value,
          currentAccount: prevState.accounts[event.target.value],
        }
      })
  }

  render() {

    if(!this.state.initialized)
      return (<div>Loading...</div>)
    
    return (
      <div className="pure-g">
        
        <div className="pure-u-1 header">
          <div className="container">
            <img src={logo} alt="logo"/>
            <h1>Pedro Token</h1>
            <p>This is a QA testing application for Pedro ERC20 Token.</p>
            <br/><br/>
          </div>
        </div>

        <div className="pure-u-1-2">
          <div className="container">
            <h2>Balances</h2>
            <BalanceRange
              drizzle={this.props.drizzle}
              drizzleState={this.props.drizzle.store.getState()}
              accountsToRetrieve={4} 
              passedAccounts={this.props.drizzle.store.getState().accounts} />
          </div>
        </div>

        <div className="pure-u-1-2">
          <h2>Send tokens</h2>
          <h3>Select account index to send from</h3>
          <input 
            type="number" 
            value={this.state.index} 
            onChange={this.changeIndex} />
          <h3>You will send tokens from this account</h3>
          <Balance
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzle.store.getState()}
            currentAccount={this.props.drizzle.store.getState().accounts[this.state.index]} />
          <br/>
          <h3>Select account to send tokens to</h3>
          <ContractForm
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzle.store.getState()}
            contract="Pedro_ERC20Token" 
            method="transfer" 
            labels={['To Address', 'Amount to Send']}
            sendArgs={{from: this.state.currentAccount}} />
          <br/><br/>
        </div>

      </div>
    )
  }
}

export default () => (
  <DrizzleContext.Consumer>
    {
      drizzleContext => {
        var drizzle = drizzleContext.drizzle
        var drizzleState = drizzle.store.getState()
        return (
          <Home
            drizzleState={drizzleState}
            drizzle={drizzle} />
        )
      }
    }
  </DrizzleContext.Consumer >
)