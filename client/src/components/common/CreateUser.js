import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class CreateUser extends Component {

    componentDidMount() {
        fetch('https://vast-thicket-16737.herokuapp.com/createUser')
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