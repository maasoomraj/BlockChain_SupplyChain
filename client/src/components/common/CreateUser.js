import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class CreateUser extends Component {

    componentDidMount() {
        fetch(window.location.protocol
            + '//'
            + window.location.hostname
            + ":"
            + window.location.port
            + '/createUser')
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

export default CreateUser;