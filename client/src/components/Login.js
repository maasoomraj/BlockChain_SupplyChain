import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class Login extends Component {

    componentDidMount() {
        fetch('http://localhost:3001/login')
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