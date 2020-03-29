import React, { Component } from 'react';
import axios from 'axios';

class PoolMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            maps: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:3001/api/transactionpoolmap')
        .then(response => {
            console.log(response)
            this.setState({maps:response.data})
        })
    }

    render() {
        const { maps } = this.state
        return(
            <div>
                { JSON.stringify(maps) }
            </div>
        );
    }
}

export default PoolMap;