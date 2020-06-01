import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class App extends Component {
    
    render() {
        return (
            <div>
                <div className='navbar'>
                        <Link className ="heading">SUPPLY CHAIN MANAGEMENT</Link>
                        <Link to='/Log-in' >Login</Link>
                        <Link to='/Create-User'>Create User</Link>
                </div>
                <div className="home">
                    WELCOME TO SUPPLYCHAIN MANAGEMENT
                </div>
            </div>
        )
    }
};

export default App;