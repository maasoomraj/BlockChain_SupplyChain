import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import Navigation from './common/Navigation';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

class Trace extends Component {
  state = { product: '', traceArray: [], isLoggedIn: true, userArray: [] };

  updateProduct = (event) => {
    this.setState({ product: event.target.value });
  };

  userDB = async (traceArray) => {
    // console.log(traceArray);
    let userArray = [];
    for (let i in traceArray) {
      console.log(traceArray[i]);
      await fetch(
        window.location.protocol +
          '//' +
          window.location.hostname +
          ':' +
          window.location.port +
          '/api/user/getUser',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: traceArray[i] }),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          userArray.push(json.user);
          console.log(json.user);
        });
    }

    this.setState({ userArray: userArray });
  };

  traceProduct = () => {
    const { product } = this.state;
    let traceArray = [];

    fetch(
      window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/api/trace',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        // traceArray = json.traceArray;
        // console.log(json.traceArray);
        this.userDB(json.traceArray);
        this.setState({ traceArray: json.traceArray });
      });
  };

  render() {
    let modalShow = true;
    const { traceArray, isLoggedIn } = this.state;
    return (
      <div>
        <Navigation />
        <div className="ConductTransaction">
          <h3> Trace a Product </h3>
          <FormGroup>
            <FormControl
              input="text"
              placeholder="Product Name"
              value={this.state.product}
              onChange={this.updateProduct}
            />
          </FormGroup>
          <div align="center">
            <Button
              className="button"
              bsstyle="danger"
              onClick={this.traceProduct}
            >
              Trace
            </Button>
          </div>
        </div>
        <div>
          {/* { traceArray.length>0 && 
                <div className='trace'>
                    <h3 className='mar-b'> The Product is found at address:  </h3>
                    <div className='trace-timeline'>
                        <VerticalTimeline>
                        {traceArray.map(trace => <VerticalTimelineElement>{trace}</VerticalTimelineElement>)}
                        </VerticalTimeline>
                    </div>
                </div>
                } */}

          {this.state.userArray.length > 0 && (
            <div className="trace">
              <h3 className="mar-b"> The Product is found at address: </h3>
              <div className="trace-timeline">
                <VerticalTimeline>
                  {this.state.userArray.map((user) => (
                    <VerticalTimelineElement>
                      Name - {user.name}
                      <br />
                      Phone - {user.phone}
                      <br />
                      Address - {user.address.substring(0, 17)}...
                    </VerticalTimelineElement>
                  ))}
                </VerticalTimeline>
              </div>
            </div>
          )}

          {/* {this.state.userArray.length &&
                <div className='trace'>
                    The Product is found at address: <br></br><br></br>
                    <ul>
                    {this.state.userArray.map(user => <li>{user.name} | {user.phone}</li>)}
                    </ul>
                </div>
                } */}
        </div>
      </div>
    );
  }
}

export default Trace;
