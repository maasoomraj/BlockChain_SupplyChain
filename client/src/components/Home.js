import React,{ Component } from 'react';
import logo from '../assets/logo.png';
import Navigation from './common/Navigation';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
const localStorage = require('localStorage');

class Home extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch(window.location.protocol
            + '//'
            + window.location.hostname
            + ":"
            + window.location.port
            + '/api/wallet-info')
        .then(response => response.json())
        .then(json => this.setState({walletInfo: json }))
        .catch((err) => alert(error));
    }

    render() {
        // console.log(localStorage.getItem('address'));
        // console.log(JSON.parse(localStorage.getItem('user')).publicKey);
        // console.log(localStorage.getItem('user'));
        const {address,balance} = this.state.walletInfo;

        return (
            <div className='App'>
                <Navigation />
                <img className='logo' src = {logo}></img>
                <br />
                <div><h2>Hello Mr. User</h2></div>
                <br />

                <div className='walletInfo '>
                    <div>Your Address: {address}</div>
                    <div>Your Balance: {balance}</div>
                </div>

                <div>
                <Link to='/mine-transactions'>
                    <Button bsstyle="danger" bssize="small">Mine Transactions</Button>
                </Link>
                </div>
            </div>
        );
    }
}

export default Home;