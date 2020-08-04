import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import file from '../../assets/MyWallet.txt';
var fs = require("fs");

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      content: "",
      success: undefined,
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
    console.log("SUCCESS");
  };

  login = () => {
    let reader = new FileReader();
    reader.onload = () => {
      var jsonObj = JSON.parse(reader.result);

      console.log(JSON.stringify({ jsonObj }));
      fetch(
        window.location.protocol +
          "//" +
          window.location.hostname +
          ":" +
          window.location.port +
          "/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonObj }),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          alert("Success.");
        });

      this.setState({ success: true });
    };

    reader.readAsText(this.state.selectedFile);
  };

  render() {
    return (
        <Row className="login-container">
          <Col md="3" />
          <Col className="left-col" md="3">
          <h1> LOGIN </h1>
          <br />
            <input
            type="file"
            name="file"
            onChange={this.onChangeHandler}
            className="choose-file"
            />
            <Button className="button"onClick={this.login}>Login</Button>
            {this.state.success ? <Redirect to="/Home"></Redirect> : <p></p>}
          </Col>
          <Col className="right-col" md="3">
            <h1> CREATE USER </h1>
            <br />
          <p> Don't have an account?</p>
            <Button className="button">
            <a href={file} target="_blank" download="MyWallet.txt">Click to download</a>
            </Button>
          </Col>
          <Col md="3" />
        </Row>
    );
  }
}

export default Login;
