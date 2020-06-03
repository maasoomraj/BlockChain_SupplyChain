import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class Mine extends Component {

    componentDidMount() {
        fetch(window.location.protocol
            + '//'
            + window.location.hostname
            + ":"
            + window.location.port
            + '/api/mine-transactions')
        .then(response => response.json())
    }

    render() {
        return (
            <div>
                <Redirect to='/blocks'></Redirect>
            </div>
        );
    }
}

export default Mine;