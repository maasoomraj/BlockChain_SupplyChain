import React, { Component } from 'react';
import axios from 'axios';
import Navigation from './Navigation';

class Trace extends Component {
    constructor(props) {
        super(props)

        this.state = {
            traces: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:3001/api/trace')
        .then(response => {
            console.log(response)
            this.setState({traces:response.data})
        })
    }

    render() {
        const { traces } = this.state
        return(
            <div>
                <Navigation />
                <div className='Block'>
                    { JSON.stringify(traces) }
                </div>
            </div>
        );
    }
}

export default Trace;