import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { FormGroup, FormControl, Button, Row, Col } from 'react-bootstrap';
import file from '../../assets/MyWallet.txt';
import avatar1 from '../../assets/avatar.webp';
import avatar2 from '../../assets/avatar-2.webp';
const localStorage = require('localStorage');
var fs = require('fs');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      content: '',
      success: undefined,
      name: '',
      phone: '',
      download: false,
      jsonText: {},
    };
  }

  onChangeHandler = (event) => {
    let files = event.target.files;
    this.setState(
      {
        selectedFile: files[0],
      },
      () => {
        console.log(files[0]);
      }
    );
  };

  onQ = () => {
    console.log('SUCCESS');
  };

  login = () => {
    let reader = new FileReader();
    reader.onload = () => {
      var jsonObj = JSON.parse(reader.result);

      // console.log(JSON.stringify({ jsonObj }));
      fetch(
        window.location.protocol +
          '//' +
          window.location.hostname +
          ':' +
          window.location.port +
          '/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonObj }),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          // localStorage.setItem('address', JSON.parse(json.wallet).publicKey)
          localStorage.setItem('user', JSON.stringify(json.wallet));
          this.setState({ success: true });
        });
    };

    reader.readAsText(this.state.selectedFile);
  };

  createUser = async () => {
    if (!this.state.name) {
      alert('Please enter name');
      return;
    }

    if (!this.state.phone || this.state.phone.length != 10) {
      alert('Please enter a valid phone number of 10 digits');
      return;
    }

    for (let i = 0; i < 10; i++) {
      if (!(this.state.phone[i] - '0' >= 0 && this.state.phone[i] - '0' <= 9)) {
        alert('Phone Number is not valid');
        return;
      }
    }

    let addressText;

    await fetch(
      window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/createUser'
    )
      .then((response) => response.json())
      .then((json) => {
        // console.log(json.wallet);
        console.log(JSON.parse(json.wallet).publicKey);
        addressText = JSON.parse(json.wallet).publicKey;
        this.setState({ jsonText: json.wallet });
      });

    await fetch(
      window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/api/user/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.state.name,
          phone: this.state.phone,
          address: addressText,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        alert('Success.');
        this.setState({ download: true });
      })
      .catch(function (error) {
        console.log(error);
        alert('User already exists with this phone number');
      });
  };

  render() {
    return (
      <Row className="login-container">
        <Col md="3" />
        <Col className="left-col" md="3">
          <img src={avatar1} height="100px" />
          <h1> LOGIN </h1>
          <input
            type="file"
            name="file"
            onChange={this.onChangeHandler}
            className="choose-file"
          />
          <Button className="button" onClick={this.login}>
            Login
          </Button>
          {this.state.success ? <Redirect to="/Home"></Redirect> : <p></p>}
        </Col>
        <Col className="right-col" md="3">
          <img src={avatar2} height="100px" />
          <h1> CREATE USER </h1>
          <br />
          <FormGroup>
            <FormControl
              input="text"
              placeholder="Enter Store Name"
              value={this.state.name}
              onChange={(event) => this.setState({ name: event.target.value })}
            />
            <br />
            <FormControl
              input="text"
              placeholder="Enter Phone Number"
              value={this.state.phone}
              onChange={(event) => this.setState({ phone: event.target.value })}
            />
          </FormGroup>

          <Button className="button" onClick={this.createUser}>
            {/* <a href={file} target="_blank" download="MyWallet.txt">Create</a> */}
            Create
          </Button>
          {/* {this.state.download &&
            <Button className="button" onClick={this.createUser}>
            <a href={file} target="_blank" download="MyWallet.txt">Create</a>
            </Button>} */}

          {this.state.download && (
            <Button
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(this.state.jsonText)
              )}`}
              download={'MyWallet_' + this.state.phone + '.json'}
            >
              {`Download Json`}
            </Button>
          )}
        </Col>
        <Col md="3" />
      </Row>
    );
  }
}

export default Login;
