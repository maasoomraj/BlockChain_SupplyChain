import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';

class Block extends Component {

    state = { displayTransaction: false };

    toggleTransaction = () => {
        this.setState({displayTransaction: !this.state.displayTransaction });
    }

    get displayTransaction() {
        const { data } =  this.props.block;

        if (this.state.displayTransaction){
            return(
                <div>
                    {
                        data.map(transaction => (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div> 
                        ))
                    }
                    <br />
                    <Button bsstyle="danger" bssize="small" onClick={this.toggleTransaction}>Show less </Button>
                </div>
            )
        }

        return (    
            <div>
                <div align='center'>
                <Button className = 'button' onClick={this.toggleTransaction}>Show more </Button>
                </div>
            </div>
        );
    }

    render () {

        const { timestamp, lastHash, hash } =  this.props.block;

        return (
            <div>
                { hash != '000000' &&
                <div className='Block'>
                    <div> Hash : {hash} </div>
                    <div> LastHash : {lastHash} </div>
                    <div> Timestamp: {new Date(timestamp).toLocaleDateString()}</div>
                    {this.displayTransaction}
                </div>
                }
            </div>
        );
    }
};

export default Block;