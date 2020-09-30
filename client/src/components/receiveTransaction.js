import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import Navigation from './common/Navigation';

class receiveTransaction extends Component {
  state = {
    product: '',
    quantity: '',
    amount: '',
    from: '',
    userTo: {},
    userLoaded: false,
    phoneError: false,
  };

  updateRProduct = (event) => {
    this.setState({ product: event.target.value });
  };

  updateRQuantity = (event) => {
    this.setState({ quantity: event.target.value });
  };

  updateRAmount = (event) => {
    this.setState({ amount: Number(event.target.value) });
  };

  updateRFrom = (event) => {
    this.setState({ from: event.target.value });
    this.getAddress(event.target.value);
  };

  getAddress = (phone) => {
    if (phone.length != 10) {
      this.setState({ userTo: {}, userLoaded: false, phoneError: false });
      return;
    }

    for (let i = 0; i < 10; i++) {
      if (!(phone[i] - '0' >= 0 && phone[i] - '0' <= 9)) {
        this.setState({ userTo: {}, userLoaded: false, phoneError: true });
        return;
      }
    }

    fetch(
      window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/api/user/getUserByPhone',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json.user);
        this.setState({
          userTo: json.user,
          userLoaded: true,
          phoneError: false,
        });
      })
      .catch((err) =>
        this.setState({ userTo: {}, userLoaded: false, phoneError: true })
      );
  };

  conductReceiveTransaction = () => {
    const input = {
      product: this.state.product,
      quantity: this.state.quantity,
      amount: this.state.amount,
      from: this.state.userTo.address,
    };
    // console.log(input);

    fetch(
      window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/api/receive',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        alert('Success.');
      });
  };

  render() {
    return (
      <div>
        <Navigation />
        <div className="receiveTransaction">
          <br />
          <h3>Receive Transaction -</h3>

          <FormGroup>
            <FormControl
              input="text"
              placeholder="Product Number"
              value={this.state.product}
              onChange={this.updateRProduct}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              input="text"
              placeholder="Quantity"
              value={this.state.quantity}
              onChange={this.updateRQuantity}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              input="number"
              placeholder="Amount"
              value={this.state.amount}
              onChange={this.updateRAmount}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              input="text"
              placeholder="From"
              value={this.state.from}
              onChange={this.updateRFrom}
            />
          </FormGroup>

          {this.state.userLoaded && (
            <div className="sendTo">
              <p className="sendToText">
                Name - {this.state.userTo.name} <br />
                Phone - {this.state.userTo.phone} <br />
                Address = {this.state.userTo.address.substring(0, 20)}....{' '}
                <br />
              </p>
            </div>
          )}

          {this.state.phoneError && (
            <div className="sendTo">
              <p className="sendToText">
                Phone number is incorrect or doesnot match with any User. Please
                check the number !
              </p>
            </div>
          )}

          <div align="center">
            <Button
              className="button"
              onClick={this.conductReceiveTransaction}
              disabled={!this.state.userLoaded}
            >
              Receive
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default receiveTransaction;
