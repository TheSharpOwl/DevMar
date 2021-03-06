import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import Navbar from './Navbar'
import Marketplace from '../abis/Marketplace.json'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] }) // please make sure this is the Seller Acccount
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    if (networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace }) // short hand for marketplace : marketplace
      const productCount = await marketplace.methods.productCount().call()
      this.setState({ productCount })
      // Load the products from the mapping in solidity
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false })

      const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum'
      const response = await fetch(url);
      var data = await response.json();
      console.log(data[0]['current_price'])
      let currentPrice = data[0]['current_price']
      this.setState({ exchangeRate: currentPrice })

    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = { // The Initial state
      account: '',
      productCount: 0,
      products: [],
      loading: true,
      exchangeRate: -1
    }

    this.createProduct = this.createProduct.bind(this) // to make react know that the createProduct() (below this comment) is the same as the one called in render()
    this.purchaseProduct = this.purchaseProduct.bind(this) // same as the line above it but for purchasing
  }

  createProduct(name, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  purchaseProduct(id, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> // Show loading state to the user
                : <Main
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct} />
              }
            </main>
          </div>
        </div>
        <div>
          {this.state.loading
            ? <h4></h4>
            : <h4>&nbsp;&nbsp;Exchange rate 1 Eth = {this.state.exchangeRate}$</h4>
          }
        </div>
      </div>
    );
  }
}

export default App;
