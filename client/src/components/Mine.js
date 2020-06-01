import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';

class Mine extends Component {

    componentDidMount() {
        fetch('http://localhost:3001/api/mine-transactions')
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