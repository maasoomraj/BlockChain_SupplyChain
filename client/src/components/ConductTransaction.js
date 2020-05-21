import React, { Component } from 'react';
import { FormGroup, FormControl,Button } from 'react-bootstrap';
import Navigation from './Navigation';

class ConductTransaction extends Component {
    state = { recipient: '', amount: ''};

    updateRecipient = event => {
        this.setState({ recipient : event.target.value});
    }

    updateAmount = event => {
        this.setState({ amount : Number(event.target.value) });
    }

    conductTransaction = () => {
        const { recipient, amount} = this.state;

        fetch('http://localhost:3001/api/transact', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({recipient,amount })
    }).then(response => response.json())
        .then(json => {
            alert(json.message || json.type);
        });    
        
    }

    render() {

        return (
            <div>
                <Navigation />
                <div className='ConductTransaction'>
                    <h3> Conduct a Transaction </h3>
                    <FormGroup>
                        <FormControl 
                            input = 'text'
                            placeholder = 'Recipient Address'
                            value={this.state.recipient}
                            onChange={this.updateRecipient}    
                        />
                    </FormGroup>
                    <FormGroup>
                    <FormControl 
                            input = 'number'
                            placeholder = 'Amount'
                            value={this.state.amount}
                            onChange={this.updateAmount}    
                        />
                    </FormGroup>
                    <div align='center'>
                        <Button className='button'
                            bsstyle="danger"
                            onClick={this.conductTransaction}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
};

export default ConductTransaction;