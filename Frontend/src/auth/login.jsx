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
var Recaptcha = require('react-gcaptcha');
class Login extends React.Component {
  constructor(props, context) {
    super(props,context);
    
    this.state = {
      signup:false,
      login:true,
      key: 1,
      'email': '',
      'password': '',
      validate: {
        emailState: ''
      }
    }
    
    this.handleChange = this.handleChange.bind(this);
  
    this.handleSelect = this.handleSelect.bind(this);
    
  }
  
  //To validate email to match regex
  validateEmail(e) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
      if (emailRex.test(validate.email)) {
        validate.emailState = 'has-success'
      } else {
        validate.emailState = 'has-danger'
      }
      this.setState({ validate })
    }

  //To update state on change of input  
  handleChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [ name ]: value
    });
    const { validate } = this.state
    this.setState({ validate })
  }

  // Form validation and post validation
  submitForm(e) {
    e.preventDefault();
    console.log(`Email: ${ this.state.email }`)
  }

  handleSelect(key) {
    this.setState({ key });
  }

  render() {
    const { email, password } = this.state;
    return (<Popup className="SidebarUserSignUp"
              trigger = {<p>Login/Signup <FontAwesome name="Login" className="fa fa-sign-out" /></p>}
              position = "bottom center"
              on = "hover"
              closeOnDocumentClick
              mouseLeaveDelay = {300}
              mouseEnterDelay = {0}
              overlayStyle = {{backgroundColor: 'transparent'}}>
                <Tabs
                  activeKey={this.state.key}
                  onSelect={this.handleSelect}
                  id="controlled-tab-example">
                    <Tab eventKey={1} title="Log In">
                      <Form onSubmit={ (e) => this.submitForm(e) }>
                        <Col>
                          <FormGroup>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              name="email"
                              id="userEmail"
                              value={ this.state.email }
                              valid={ this.state.validate.emailState === 'has-success' }
                              invalid={ this.state.validate.emailState === 'has-danger' }
                              required
                              onChange={this.handleChange}
                              //this.validateEmail(e)}}
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label for="userPassword">Password</Label>
                            <Input
                              type="password"
                              name="password"
                              id="userPassword"
                              value={ password }
                              required
                              onChange={this.handleChange.bind(this)} 
                            />
                          </FormGroup>
                        </Col>
                        <Button id="login_button">Submit</Button>
                      </Form>
                    </Tab>
                    <Tab eventKey={2} title="Sign Up">
                     <Form className="form" onSubmit={ (e) => this.submitForm(e) }>
                        <Col>
                          <FormGroup>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              name="email"
                              id="userEmail"
                              value={ email }
                              valid={ this.state.validate.emailState === 'has-success' }
                              invalid={ this.state.validate.emailState === 'has-danger' }
                              onChange={ (e) => {
                                          this.validateEmail(e)
                                          this.handleChange(e)
                                        } }
                            required />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label for="userPassword">Password</Label>
                            <Input
                              type="password"
                              name="password"
                              id="userPassword"
                              value={ password }
                              required
                              onChange={ (e) => this.handleChange(e) }
                            />
                          </FormGroup>
                        </Col>
                        <Recaptcha sitekey="6LfQWXEUAAAAAFtwz82Pefv5SHDkqc6_Deyxhd75" render="explicit" />
                        <Button id="signup_button">Submit</Button>
                      </Form>
                    </Tab>
                </Tabs>
            </Popup>);
  }
}

export default Login;