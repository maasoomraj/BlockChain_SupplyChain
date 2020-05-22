import React, { Component } from 'react';
import axios from 'axios';
import Navigation from './Navigation';

class PoolMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: "hi",
            outputMap: "hi",
            input: "hi",
        };
    }

    componentDidMount() {
        axios.get('http://localhost:3001/api/transactionpoolmap')
        .then(response => {
            console.log(response)
            this.setState({maps:response.data})
        })
    }

    render() {
        const { id, outputMap,input } = this.state
        return(
            <div>
                <Navigation />
                <div className='Block'>
                    {id}
                </div>
            </div>
        );
    }
}

export default PoolMap;