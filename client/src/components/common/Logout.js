import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class Logout extends Component {

    componentDidMount() {
        fetch('http://localhost:3001/logout')
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