import React, { Component } from 'react';
import axios from 'axios';

class Minedata extends Component {
    constructor(props) {
        super(props)

        this.state = {
            mines: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:3001/api/mine-transactions')
        .then(response => {
            console.log(response)
            this.setState({mines:response.data})
        })
    }

    render() {
        const { mines } = this.state
        return(
            <div>
                { JSON.stringify(mines) }
            </div>
        );
    }
}

export default Minedata;