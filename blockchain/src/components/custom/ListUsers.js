import React, { Component } from 'react';
import Web3 from 'web3';
import Election from '../../build/Election.json'

class ListUsers extends Component{

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
        console.log(accounts)
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Election.networks[networkId]
        if(networkData) {
            const election = new web3.eth.Contract(Election.abi, networkData.address)
            this.setState({ election })
            const userCount = await election.methods.usersCount().call()
            this.setState({ userCount })
            for (var i = 1; i <= userCount; i++) {
                const user = await election.methods.users(i).call()
                this.setState({
                    users: [...this.state.users, user]
                })
            }
            console.log(this.state.users);
        } else {
            window.alert('Election contract not deployed to detected network.')
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            id: null,
            account: '',
            userCount: 0,
            users: [],
            loading: true,
        }
    }

    render(){
        const usersList = this.state.users.map(user => {
            return (
                <div className="contact" key={user.id}>
                    <li className="collection-item avatar">
                        <i className="material-icons circle blue darken-2">person</i>
                        <p><b>{user.name}</b></p>
                        <p><b>{user.aadhar}</b></p>
                        <br></br>
                    </li>
                </div>
            )
        });
        return(
            <div className="container">
                <ul className="collection">
                    <li className="collection-item avatar">
                        <h3>Users</h3>
                    </li>
                        {usersList}
                </ul>
            </div>
        )
    }
}

export default ListUsers;
