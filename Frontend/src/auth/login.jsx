import React from 'react';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Form, FormControl, Label, Input, Col, FormGroup, FormFeedback, HelpBlock,ControlLabel, Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import {Tabs, Tab } from 'react-bootstrap';
require('react-bootstrap')
import userValidator from './validators';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userCred: {
        email: '',
        password: '',
      }
    };
    this.validators = userValidator;
    this.resetValidators();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.displayValidationErrors = this.displayValidationErrors.bind(this);
    this.updateValidators = this.updateValidators.bind(this);
    this.resetValidators = this.resetValidators.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
  }
  
  resetValidators() {
    Object.keys(this.validators).forEach((fieldName) => {
      this.validators[fieldName].errors = [];
      this.validators[fieldName].state = '';
      this.validators[fieldName].valid = false;
    });
  }

  handleRegister(e) {
    e.preventDefault();
     const email = this.state.userCred.email
     const password = this.state.userCred.password
    fetch('http://localhost:3300/api/auth/register/',{
      credentials: 'include',
      method:'post',
      headers: new Headers({
     'Authorization': 'Basic '+btoa('username:password'),
     'Content-Type':'application/json'}),
      body: JSON.stringify({ "email": email, "password": password})
    }).then(console.log);
  }

  handleLogin(e) {
    e.preventDefault();
     console.log('calling login '+this.state.userCred.email);
     const email = this.state.userCred.email
     const password = this.state.userCred.password
    fetch('http://localhost:3300/api/auth/login/',{
      credentials: 'include',
      method:'post',
      headers: new Headers({
     'Authorization': 'Basic '+btoa('username:password'),
     'Content-Type':'application/json'}),
      body: JSON.stringify({ "email": email, "password": password})
    }).then(console.log);
  }
  

  updateValidators(fieldName, value) {
    this.validators[fieldName].errors = [];
    this.validators[fieldName].state = value;
    this.validators[fieldName].valid = true;
    this.validators[fieldName].rules.forEach((rule) => {
      if (rule.test instanceof RegExp) {
        if (!rule.test.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      } else if (typeof rule.test === 'function') {
        if (!rule.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      }
    });
  }
  handleInputChange(event, inputPropName) {
    const newState = Object.assign({}, this.state);
    newState.userCred[inputPropName] = event.target.value;
    this.setState(newState);
    this.updateValidators(inputPropName, event.target.value);
  }

   displayValidationErrors(fieldName) {
    const validator = this.validators[fieldName];
    const result = '';
    if (validator && !validator.valid) {
      const errors = validator.errors.map((info, index) => {
        return <span className="SidebarLoginErrorMsg" key={index}>&nbsp;&nbsp;&nbsp;{info}</span>;
      });

      return (
        <div className="col s12 row">
          {errors}
        </div>
      );
    }
    return result;
    }

    isFormValid() {
    let status = true;
    Object.keys(this.validators).forEach((field) => {
      if (!this.validators[field].valid) {
        status = false;
      }
    });
    return status;
  }

  render() {
    return (<Popup className="SidebarUserSignUp"
              trigger = {<p>Login/Signup <FontAwesome name="Login" className="fa fa-sign-out" /></p>}
              position = "bottom center"
              on = "hover"
              closeOnDocumentClick
              mouseLeaveDelay = {300}
              mouseEnterDelay = {0}
              overlayStyle = {{backgroundColor: 'transparent'}}>
                <Tabs
                  id="controlled-tab-example">
                    <Tab eventKey={1} title="Log In">
                      <Form onSubmit={this.handleLogin}>
                        <Col>
                          <FormGroup>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              name="email"
                              id="userEmail"
                              required
                              value={this.state.userCred.email}
                              onChange={event => this.handleInputChange(event, 'email')}
                            />
                            <Label>{ this.displayValidationErrors('email') }</Label>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label for="userPassword">Password</Label>
                            <Input
                              type="password"
                              name="password"
                              id="userPassword"
                              required
                              value={this.state.userCred.password}
                              onChange={event => this.handleInputChange(event, 'password')}
                            />
                             <Label>{ this.displayValidationErrors('password') }</Label>
                          </FormGroup>
                        </Col>
                        <Button id="login_button">Submit</Button>
                      </Form>
                    </Tab>
                    <Tab eventKey={2} title="Sign Up">
                     <Form className="form" onSubmit={this.handleRegister}>
                        <Col>
                          <FormGroup>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              name="email"
                              id="userEmail"
                              required 
                              value={this.state.userCred.email}
                              onChange={event => this.handleInputChange(event, 'email')}/>
                              <Label>{ this.displayValidationErrors('email') }</Label>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label for="userPassword">Password</Label>
                            <Input
                              type="password"
                              name="password"
                              id="userPassword"
                              value={this.state.userCred.password}
                              onChange={event => this.handleInputChange(event, 'password')}
                            />
                             <Label>{ this.displayValidationErrors('password') }</Label>
                          </FormGroup>
                        </Col>
                        <Button id="signup_button">Submit</Button>
                      </Form>
                    </Tab>
                </Tabs>
            </Popup>);
  }
}

export default Login;