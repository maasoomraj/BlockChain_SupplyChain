import React, {Component} from 'react';
import {FormGroup, FormControl , Button } from 'react-bootstrap';
import Navigation from './common/Navigation';

class sendTransaction extends Component {
    state = {product:'', quantity:'', amount:'', to:''};

    updateProduct = event => {
        this.setState({product : event.target.value });
    }

    updateQuantity = event => {
        this.setState({quantity : event.target.value });
    }

    updateAmount = event => {
        this.setState({amount : Number(event.target.value) });
    }

    updateTo = event => {
        this.setState({to : event.target.value });
    }

    conductSendTransaction = () => {
        const input = {
            product : this.state.product,
            quantity : this.state.quantity,
            amount : this.state.amount,
            to : this.state.to
            };
        // console.log(input);

        fetch(window.location.protocol
            + '//'
            + window.location.hostname
            + ":"
            + window.location.port
            + '/api/send' , {
             method : 'POST',
             headers : { 'Content-Type' : 'application/json'},
             body : JSON.stringify({input})
        }).then(response => response.json())
            .then(json => {
                alert("Success.")
            });
    }

    render(){
        console.log('this.state', this.state);
        return(
            <div>
                <Navigation />
                <div className='sendTransaction'>
                    <br />
                    <h3>Send Transaction -</h3>

                    <FormGroup>
                        <FormControl 
                            input='text'
                            placeholder='Product Number'
                            value={this.state.product} 
                            onChange={this.updateProduct}
                        /> 
                    </FormGroup>
                    <FormGroup>
                        <FormControl 
                            input='text'
                            placeholder='Quantity'
                            value={this.state.quantity} 
                            onChange={this.updateQuantity}
                        /> 
                    </FormGroup>
                    <FormGroup>
                        <FormControl 
                            input='number'
                            placeholder='Amount'
                            value={this.state.amount} 
                            onChange={this.updateAmount}
                        /> 
                    </FormGroup>
                    <FormGroup>
                        <FormControl 
                            input='text'
                            placeholder='To'
                            value={this.state.to} 
                            onChange={this.updateTo}
                        /> 
                    </FormGroup>
                    <div align='center'>
                        <Button className = 'button' onClick={this.conductSendTransaction}>Send</Button>
                    </div>
                </div>
            </div>
        );
    }
};

export default sendTransaction;