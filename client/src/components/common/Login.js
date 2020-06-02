import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class Login extends Component {

    componentDidMount() {
        fetch('https://vast-thicket-16737.herokuapp.com/login')
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