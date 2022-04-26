import React, { Component } from 'react';
import Web3 from 'web3';
import Election from '../../build/Election.json'

class NewUser extends Component{
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockChain()
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

    handleInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    async loadBlockChain(){
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Election.networks[networkId]
        if(networkData) {
            const election = new web3.eth.Contract(Election.abi, networkData.address)
            this.setState({ election })
        } else {
            window.alert('Election contract not deployed to detected network.')
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.addUser();
    }

    addUser() {
        console.log(this.state);
        this.setState({ loading: true })
        this.state.election.methods.addUser(this.state.user_name, this.state.user_aadhar, this.state.user_election_id).send({ from: this.state.account })
        .once('receipt', (receipt) => {
            console.log(receipt);
          this.setState({ loading: false })
          window.location.assign("/");
        })
    }

    constructor(props) {
        super(props)
        this.state = {
          account: '',
          election: null,
          user_name: null,
          user_aadhar: null,
          user_election_id: null,
        }
        this.addUser = this.addUser.bind(this)
    }

    componentDidMount(){
    }

    render(){
        return(
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" id="user_name" name="user_name" onChange={this.handleInputChange} required/>
                    <label htmlFor="name">User Name</label><br></br>
                    <input type="text" id="user_aadhar" name="user_aadhar" onChange={this.handleInputChange} required/>
                    <label htmlFor="name">User AADHAR</label><br></br><br></br>
                    <input type="text" id="user_election_id" name="user_election_id" onChange={this.handleInputChange} required/>
                    <label htmlFor="name">Constituency ID</label><br></br><br></br>
                    <button className="btn blue darken-2" type="submit" name="action">Submit
                        <i className="material-icons right">send</i>
                    </button>
                </form>
            </div>
        )
    }
}

export default NewUser;
