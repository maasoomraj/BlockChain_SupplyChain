import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import img from '../assets/blockchain-supply-chain-management-system.jpg';

class App extends Component {
    
    render() {
        return (
            <div>
                <div className='navbar'>
                        <Link className ="heading">SUPPLY CHAIN MANAGEMENT</Link>
                        <Link to='/Log-in' >Login</Link>
                </div>
                <div className="home">
                    WELCOME TO SUPPLYCHAIN MANAGEMENT
                </div>
                <img className='bgimg' src={img} />
            </div>
        )
    }
};

export default App;