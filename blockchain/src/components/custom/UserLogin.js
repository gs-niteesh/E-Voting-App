import Web3 from 'web3';
import Election from '../../build/Election.json'
import React, { Component } from 'react'
import axios from 'axios'

class UserLogin extends Component {
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
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Election.networks[networkId]
        if(networkData) {
            const election = new web3.eth.Contract(Election.abi, networkData.address)
            this.setState({ election })
            const userCount = await election.methods.usersCount().call()
            for (var i = 1; i <= userCount; i++) {
                const user = await election.methods.users(i).call()
                this.setState({
                    users: [...this.state.users, user]
                })
            }
        } else {
            window.alert('Election contract not deployed to detected network.')
        }
    }

    constructor(props){
        super(props)
        this.state = {
            username: null,
            aadhar: null,
            users: [],
        }
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const username = this.state.username;
        const aadhar = this.state.aadhar;
        const users = this.state.users;

        console.log('User: ', username);
        console.log('AADHAR: ', aadhar);
        let foundUser = false;
        users.forEach((user) => {
            if (username === user.name && aadhar === user.aadhar) {
                console.log('Matched user: ', user);
                window.location.assign(`/vote/${user.contituency_id}`);
                foundUser = true;
            }
        });
        if (!foundUser) {
            window.alert("No such user found!");
            window.location.assign("/");
        }
    }


    render(){
        return(
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" id="username" name="username" onChange={this.handleInputChange} required/>
                    <label htmlFor="name">Username</label><br></br>
                    <input type="text" id="aadhar" name="aadhar" onChange={this.handleInputChange} required/>
                    <label htmlFor="name">AADHAR</label><br></br><br></br>
                    <button className="btn blue darken-2" type="submit" name="action">Submit
                        <i className="material-icons right">send</i>
                    </button>
                </form>
            </div>
        )
    }
}

export default UserLogin;
