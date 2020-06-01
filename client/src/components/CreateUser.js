import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class CreateUser extends Component {

    componentDidMount() {
        fetch('http://localhost:3001/createUser')
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