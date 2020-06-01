import React,{ Component } from 'react';
import logo from '../assets/logo.png';
import Navigation from '../components/Navigation';
import { Link, Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Home extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch('http://localhost:3001/api/wallet-info')
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
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>

                <div>
                <Link to='/mine-transactions'>
                    {/* <Redirect to='/blocks'> */}
                    <Button bsstyle="danger" bssize="small">Mine Transactions</Button>
                    {/* </Redirect> */}
                </Link>
                
                </div>
            </div>
        );
    }
}

export default Home;