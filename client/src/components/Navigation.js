import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

class Navigation extends Component {
    render() {
        return (
            <div className='navbar'>
                    <Link to ='/' className ="heading">SUPPLY CHAIN MANAGEMENT</Link>
                    <Link to ='/'>Home</Link>
                    <Link to='/blocks'>Blocks</Link>
                    <Link to='/conduct-transaction'>Conduct a Transaction</Link>
                    <Link to='/send-transaction'>Send</Link>
                    <Link to='/receive-transaction'>Receive</Link>
                    <Link to='/transaction-pool-map'>Transaction Pool Map</Link>
                    <Link to='/mine-transactions'>Mine transactions</Link>
                    <Link to='/trace'>Trace</Link>
                </div>
        );
    }
}

export default Navigation;