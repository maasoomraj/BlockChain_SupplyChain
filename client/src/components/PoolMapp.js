import React, { Component } from 'react';
import Navigation from './common/Navigation';
import { Redirect } from 'react-router-dom';

class PoolMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            transactionPool: {},
            isLoggedIn: true,
        };
    }

    componentDidMount() {
        fetch('http://localhost:3001/api/transactionpoolmap')
        .then(response => response.json())
        .then(json => this.setState({ transactionPool: json.transactionPool,isLoggedIn: json.isLoggedIn}));
    }

    display = (transactionPool) => {
        for (let index = 0; index < transactionPool.length; index++) {
            transactionPool[index].id    
        }
    }

    render() {
        const { transactionPool,isLoggedIn } = this.state;
        console.log(transactionPool);
        var keys = Object.keys(transactionPool);
        if (isLoggedIn===false) {
            return(
                <Redirect to='/'></Redirect>
            );
        } 
        else {
            return(
                <div>
                    <Navigation />
                    <div className='Block'>
                        {JSON.stringify(transactionPool)}
                    </div>
                </div>
            );
        }
    }
}

export default PoolMap;