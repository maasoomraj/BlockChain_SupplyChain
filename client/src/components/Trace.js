import React, { Component } from 'react';
import { FormGroup, FormControl,Button } from 'react-bootstrap';
import Navigation from './common/Navigation';

class Trace extends Component {
    state = { product: '' , traceArray : [], isLoggedIn : true};

    updateProduct = event =>{
        this.setState({ product : event.target.value});
    }

    traceProduct = () => {
        const { product } = this.state;

        fetch(window.location.protocol
            + '//'
            + window.location.hostname
            + ":"
            + window.location.port
            + '/api/trace', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({product})
    }).then(response => response.json())
        .then(json => this.setState({ traceArray: json.traceArray})); 
    }

    render() {
        const {traceArray,isLoggedIn} = this.state;
        return(
            <div>
                <Navigation />
                <div className='ConductTransaction'>
                <h3> Trace a Product </h3>
                    <FormGroup>
                        <FormControl 
                            input = 'text'
                            placeholder = 'Product Name'
                            value={this.state.product}
                            onChange={this.updateProduct}    
                        />
                    </FormGroup>
                    <div align='center'>
                        <Button className='button'
                            bsstyle="danger"
                            onClick={this.traceProduct}>
                            Trace
                        </Button>
                    </div>
                </div>
                <div>
                { traceArray.length>0 && 
                <div className='trace'>
                    The Product is found at address: <br></br><br></br>
                    <ul>
                    {traceArray.map(trace => <li>{trace}</li>)}
                    </ul>
                </div>
    }
    </div>
            </div>
        );
    }
}

export default Trace;