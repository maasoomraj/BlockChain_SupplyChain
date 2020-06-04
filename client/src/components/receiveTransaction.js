import React, {Component} from 'react';
import {FormGroup, FormControl , Button } from 'react-bootstrap';
import Navigation from './common/Navigation';

class receiveTransaction extends Component {
    state = {product:'', quantity:'', amount:'', from:''};

    updateRProduct = event => {
        this.setState({product : event.target.value });
    }

    updateRQuantity = event => {
        this.setState({quantity : event.target.value });
    }

    updateRAmount = event => {
        this.setState({amount : Number(event.target.value) });
    }

    updateRFrom = event => {
        this.setState({from : event.target.value });
    }

    conductReceiveTransaction = () => {
        const input = {
            product : this.state.product,
            quantity : this.state.quantity,
            amount : this.state.amount,
            from : this.state.from
            };
        // console.log(input);

        fetch('http://localhost:3001/api/receive' , {
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
                <div className='receiveTransaction'>
                    <br />
                    <h3>Receive Transaction -</h3>

                    <FormGroup>
                        <FormControl 
                            input='text'
                            placeholder='Product Number'
                            value={this.state.product} 
                            onChange={this.updateRProduct}
                        /> 
                    </FormGroup>
                    <FormGroup>
                        <FormControl 
                            input='text'
                            placeholder='Quantity'
                            value={this.state.quantity} 
                            onChange={this.updateRQuantity}
                        /> 
                    </FormGroup>
                    <FormGroup>
                        <FormControl 
                            input='number'
                            placeholder='Amount'
                            value={this.state.amount} 
                            onChange={this.updateRAmount}
                        /> 
                    </FormGroup>
                    <FormGroup>
                        <FormControl 
                            input='text'
                            placeholder='From'
                            value={this.state.from} 
                            onChange={this.updateRFrom}
                        /> 
                    </FormGroup>
                    <div align='center'>
                        <Button className='button' onClick={this.conductReceiveTransaction}>Receive</Button>
                    </div>
                </div>
            </div>
        );
    }
};

export default receiveTransaction;