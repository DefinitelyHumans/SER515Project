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
import {NotificationManager} from 'react-notifications';
import Modal from './../modal';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userDetails: {
        loggedIn: false,
            user_id: '',
            email: '',
            password: ''
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
    this.handleLogout = this.handleLogout.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleUserDetails = this.handleUserDetails.bind(this);
  }
  
  handleUserDetails(e){
    this.props.handleUserDetails(this.state.userDetails);
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
     const email = this.state.userDetails.email
     const password = this.state.userDetails.password
    fetch('http://localhost:3300/api/auth/register/',{
      credentials: 'include',
      method:'post',
      headers: new Headers({
     'Authorization': 'Basic '+btoa('username:password'),
     'Content-Type':'application/json'}),
      body: JSON.stringify({ "email": email, "password": password})
    }).then(function(response) {
        if(!response.ok) {
          let resp = response.json();
          resp.then(function(resp) {
                NotificationManager.error(resp.error);
              });
        }
        else
        NotificationManager.success('You can now login with '+email);        
  });
  }

  handleLogin(e) {
   
    e.preventDefault();
    let curComponent = this;
     let auth = '';
     const email = this.state.userDetails.email
     const password = this.state.userDetails.password
    fetch('http://localhost:3300/api/auth/login/',{
      credentials: 'include',
      method:'post',
      headers: new Headers({
     'Authorization': 'Basic '+btoa('username:password'),
     'Content-Type':'application/json'}),
      body: JSON.stringify({ "email": email, "password": password})
    }).then(function(response) {
        let resp = response.json();        
        if(!response.ok) {
          NotificationManager.error('Error, try again!');
        }
        else{
          resp.then(function(resp) {
          auth = resp.auth_token;
          curComponent.setState({userDetails:{user_id: auth}});
          curComponent.setState({userDetails: {loggedIn: true}});
          NotificationManager.success('Logged in with email '+email);        
        })
        }
  });
  curComponent.handleUserDetails(curComponent.state.userDetails);
  }
  
  handleLogout(e){
    e.preventDefault();
    this.setState({userDetails: {email: '', password:'', loggedIn: false, user_id: ''}})
    this.handleUserDetails(this.state.userDetails);
    this.setState({visible:false});
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
    newState.userDetails[inputPropName] = event.target.value;
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

    showModal () {
        this.setState({visible: true});
    }
    
    hideModal () {
        this.setState({visible: false});
    }

  render() {
    if(!this.state.userDetails.loggedIn){
    return (<Popup
              trigger = {<p>Login/Signup <FontAwesome name="Login" className="fa fa-sign-out" /></p>}
              position = "bottom left"
              on = "hover"
              closeOnDocumentClick
              mouseLeaveDelay = {300}
              mouseEnterDelay = {0}
              overlayStyle = {{backgroundColor: 'transparent'}}>
                <Tabs id="SideBarSignUpLogin">
                    <Tab eventKey={1} title="Login">
                      <Form onSubmit={this.handleLogin}>
                        <Col>
                          <FormGroup>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              name="email"
                              id="userEmail"
                              required
                              value={this.state.userDetails.email}
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
                              value={this.state.userDetails.password}
                              onChange={event => this.handleInputChange(event, 'password')}
                            />
                             <Label>{ this.displayValidationErrors('password') }</Label>
                          </FormGroup>
                        </Col>
                        <Button>Login</Button>
                      </Form>
                    </Tab>
                    <Tab eventKey={2} title="SignUp">
                     <Form className="form" onSubmit={this.handleRegister}>
                        <Col>
                          <FormGroup>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              name="email"
                              id="userEmail"
                              required 
                              value={this.state.userDetails.email}
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
                              value={this.state.userDetails.password}
                              onChange={event => this.handleInputChange(event, 'password')}
                            />
                             <Label>{ this.displayValidationErrors('password') }</Label>
                          </FormGroup>
                        </Col>
                        <Button>SignUp</Button>
                      </Form>
                    </Tab>
                </Tabs>
            </Popup>);
  }
  else{
    return(<div><Button className="SideBarLogoutButton" onClick={this.showModal}><p>Logout <FontAwesome name="Login" className="fa fa-sign-out" /></p></Button><Modal visible={this.state.visible}>
                    <h3 className="dialogTitle">Logging out</h3>
                    <form> 
                        <p>Are you sure you want to logout?</p>
                    </form>
                    <button onClick={this.handleLogout} type="button" className="closeDialogButton">Logout</button>
                    <button onClick={this.hideModal} type="button" className="closeDialogButton">Cancel</button>
                </Modal></div>);
  }
}
}
export default Login;