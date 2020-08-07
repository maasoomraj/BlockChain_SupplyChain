import React,{ Component } from 'react';
import scm from '../assets/scm.jpg';
import Navigation from './common/Navigation';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import localStorage from 'localStorage';

class Home extends Component {
    state = { walletInfo: {}, userDB : {} };

    componentDidMount = async () => {
        let address;
        await fetch(window.location.protocol
            + '//'
            + window.location.hostname
            + ":"
            + window.location.port
            + '/api/wallet-info')
        .then(response => response.json())
        .then(json => {
            address = json.address;
            console.log((address));
            this.setState({walletInfo: json })
        })
        .catch((err) => alert(error));

        await fetch(
            window.location.protocol
            + '//'
            + window.location.hostname
            + ":"
            + window.location.port
            + '/api/user/getUser', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ address : address })
        })
        .then(response => response.json())
        .then(json => {
            // localStorage.setItem('userDB',JSON.stringify(json.user));
            localStorage.removeItem('userDB');
            this.setState({ userDB : json.user });
            console.log(json.user);
        });
    }

    render() {
        const {address,balance} = this.state.walletInfo;

        return (
            <div className='App'>
                <Navigation />
                <img className='logo' src = {scm}></img>
                <br />
                <div>
                    <p className="homeTitle">Hello {this.state.userDB.name ? this.state.userDB.name : 'User'}
                    {" "}(Phone - {this.state.userDB.phone ? this.state.userDB.phone : '0000000000'})</p>
                </div>
                <br />

                <div className='walletInfo'>
                    <p className='walletInfoText'>Your Address: {" "}{address ? address.substring(0,20)+'...' : ' Loading.... '}
                    <br />Your Balance: {" "}{balance ? balance  : ' Loading.... '}</p>
                </div>

                <div>
                <Link to='/mine-transactions'>
                    <Button className="button">Mine Transactions</Button>
                </Link>
                </div>
            </div>
        );
    }
}

export default Home;