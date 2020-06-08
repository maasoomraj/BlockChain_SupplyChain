import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class Logout extends Component {

    componentDidMount() {
        fetch(window.location.protocol
            + '//'
            + window.location.hostname
            + ":"
            + window.location.port
            + '/logout')
        .then(response => response.json())
    }

    render() {
        return (
            <div>
                <Redirect to='/'></Redirect>
            </div>
        );
    }
}

export default Logout;