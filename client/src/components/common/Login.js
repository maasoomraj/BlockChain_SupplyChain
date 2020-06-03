import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class Login extends Component {

    componentDidMount() {
        fetch(window.location.protocol
            + '//'
            + window.location.hostname
            + ":"
            + window.location.port
            + '/login')
        .then(response => response.json())
    }

    render() {
        return (
            <div>
                <Redirect to='/Home'></Redirect>
            </div>
        );
    }
}

export default Login;