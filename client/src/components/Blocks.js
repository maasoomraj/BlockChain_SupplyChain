import React, {Component} from 'react';
import Block from './Block';
import Navigation from './Navigation';
import { Redirect } from 'react-router-dom';

class Blocks extends Component {
    constructor(props) {
        super(props)

    this.state = { chain: [],isLoggedIn: true, };
    }

    componentDidMount() {
        fetch('http://localhost:3001/api/blocks')
        .then(response => response.json())
        .then(json => this.setState({ chain: json.chain,isLoggedIn: json.isLoggedIn}));
    }

    render() {
        const { chain,isLoggedIn } = this.state;
        if (isLoggedIn===false) {
            return(
                <Redirect to='/'></Redirect>
            );
    } 
    else {
        return (
            <div>
                <Navigation />
                <h3> Blocks </h3>
                {
                    chain.map(block => {
                        return (
                            <Block key={block.hash} block={block} />
                            )
                    })
                }
            </div>
        );
    }
    }
}

export default Blocks;