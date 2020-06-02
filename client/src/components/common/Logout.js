import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class Logout extends Component {

    componentDidMount() {
        fetch('https://vast-thicket-16737.herokuapp.com/logout')
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