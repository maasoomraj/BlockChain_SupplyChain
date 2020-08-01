import React,{ Component } from 'react';
import logo from '../assets/logo.png';
import Navigation from './common/Navigation';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

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
        .then(json => this.setState({walletInfo: json }));
    }

    render() {
        const {address,balance} = this.state.walletInfo;

        return (
            <div className='App'>
                <Navigation />
                <img className='logo' src = {logo}></img>
                <br />
                <div>Hey !!</div>
                <br />

                <div className='walletInfo '>
                    <div>Your Address: {address}</div>
                    <div>Your Balance: {balance}</div>
                </div>

                <div>
                <Link to='/mine-transactions'>
                    <Button bsstyle="danger" bssize="small">Mine Transactions</Button>
                </Link>

                <Button bsstyle="danger" bssize="small">
                    <a href='MyWallet.json' target="_blank" download='MyWallet.txt'>Click to download</a>
                </Button>
                
                
                </div>
            </div>
        );
    }
}

export default Home;