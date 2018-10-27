import React from 'react';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';


class Login extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (<Popup className="pull-right"
    trigger={open => (
      <FontAwesome name="Login" className="fa fa-sign-out" />
    )}
    position="bottom left"
    closeOnDocumentClick
    overlayStyle={{backgroundColor: 'transparent'}}
  >
    <span> Username: <input type="text" name="username" /> 
           Password: <input type="password" name="password" /> 
           <a href=""><FontAwesome className="fa fa-sign-out" /></a>
    </span>
  </Popup>);
  }
}

export default Login;