import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

class App extends Component {
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
                <div className='navbar'>
                    <Link to='/blocks'>Blocks</Link>
                    <Link to='/conduct-transaction'>Conduct a Transaction</Link>
                    <Link to='/send-transaction'>Send</Link>
                    <Link to='/receive-transaction'>Receive</Link>
                    <Link to='/transaction-pool-map'>Transaction Pool Map</Link>
                    <Link to='/mine-transactions'>Mine transactions</Link>
                </div>
                <img className='logo' src = {logo}></img>
                <br />
                <div>Hey !!</div>
                <br />

                <div className='walletInfo '>
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
            </div>
        );
    }
}

export default App;

// import React, {Component} from 'react';
// import {FormGroup, FormControl , Button } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// class receiveTransaction extends Component {
//     state = {product:'', quantity:'', amount:0, from:''};

//     updateProduct = event => {
//         this.setState({product : event.target.value });
//     }

//     updateQuantity = event => {
//         this.setState({quantity : event.target.value });
//     }

//     updateAmount = event => {
//         this.setState({amount : Number(event.target.value) });
//     }

//     updateFrom = event => {
//         this.setState({from : event.target.value });
//     }

//     conductReceiveTransaction = () => {
//         const input = {
//             product : this.state.product,
//             quantity : this.state.quantity,
//             amount : this.state.amount,
//             from : this.state.from
//             };
//         // console.log(input);

//         fetch('http://localhost:3001/api/receive' , {
//              method : 'POST',
//              headers : { 'Content-Type' : 'application/json'},
//              body : JSON.stringify({input})
//         }).then(response => response.json())
//             .then(json => {
//                 alert("Success.")
//             });
//     }

//     render(){
//         console.log('this.state', this.state);
//         return(
//             <div className='receiveTransaction'>
//                 <Link to = '/'> Home </Link>
//                 <br />
//                 <h3>Receive Transaction -</h3>

//                 <FormGroup>
//                     <FormControl 
//                         input='text'
//                         placeholder='Product Number'
//                         value={this.state.product} 
//                         onChange={this.updateProduct}
//                     /> 
//                 </FormGroup>
//                 <FormGroup>
//                     <FormControl 
//                         input='text'
//                         placeholder='Quantity'
//                         value={this.state.quantity} 
//                         onChange={this.updateQuantity}
//                     /> 
//                 </FormGroup>
//                 <FormGroup>
//                     <FormControl 
//                         input='number'
//                         placeholder='Amount'
//                         value={this.state.amount} 
//                         onChange={this.updateAmount}
//                     /> 
//                 </FormGroup>
//                 <FormGroup>
//                     <FormControl 
//                         input='text'
//                         placeholder='To'
//                         value={this.state.from} 
//                         onChange={this.updateFrom}
//                     /> 
//                 </FormGroup>
//                 <div>
//                     <Button bsStyle="danger" onClick={this.conductReceiveTransaction}>Send</Button>
//                 </div>
//             </div>
//         );
//     }
// };

// export default receiveTransaction;