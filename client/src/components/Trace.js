import React, { Component } from 'react';
import { FormGroup, FormControl,Button } from 'react-bootstrap';
import Navigation from './Navigation';

class Trace extends Component {
    state = { product: '' , traceArray : [], isLoggedIn : true};

    updateProduct = event =>{
        this.setState({ product : event.target.value});
    }

    traceProduct = () => {
        const { product } = this.state;

        fetch('http://localhost:3001/api/trace', {
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
                <div>
                    The Product is found at address: <br></br>
                    {JSON.stringify(traceArray)} 
                </div>
    }
    </div>
            </div>
        );
    }
}

export default Trace;