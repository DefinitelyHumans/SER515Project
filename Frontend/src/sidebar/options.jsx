import React from 'react';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Form, FormControl, Label, Input, Col, FormGroup, FormFeedback, HelpBlock,ControlLabel, Button} from 'reactstrap';
import {Modal, Panel, Tabs, Tab } from 'react-bootstrap';

// Dialog box referenced from here: https://codepen.io/IbeVanmeenen/pen/RRpLxb

class Options extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            visible: false,
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal () {
        this.setState({visible: true});
    }
    hideModal () {
        this.setState({visible: false});
    }

    handleNotifs(){
        console.log("Muted Notifications!")
    }

    handleBugs(){
        console.log("Please go to our GitHub and report an issue!")
    }

    handleDelete(){
        console.log("Your user data has been deleted");
    }

    handleData
    render(){
        return <div>
        <Panel bsStyle="primary" onClick={this.showModal}>
            <Panel.Heading>
            <Panel.Title>About CorkBoard</Panel.Title>
            </Panel.Heading>
        </Panel>
        <Panel bsStyle="primary" onClick={this.handleNotifs.bind(this)}>
            <Panel.Heading>
            <Panel.Title>Mute Notifications</Panel.Title>
            </Panel.Heading>
        </Panel>
        <Panel bsStyle="primary" onClick={this.handleBugs.bind(this)}>
            <Panel.Heading>
            <Panel.Title>Report a Bug</Panel.Title>
            </Panel.Heading>
        </Panel>
        <Panel bsStyle="primary" onClick={this.handleDelete.bind(this)}>
            <Panel.Heading>
            <Panel.Title>Delete Data</Panel.Title>
            </Panel.Heading>
        </Panel>

        <Modal show={this.state.visible} onHide={this.hideModal}>
            <Modal.Header>Hello World</Modal.Header>
            <Modal.Body>Welcome to CorkBoard. A Reddit/Slack clone made by Arizona State University students to practice AGILE development.</Modal.Body>
            <Modal.Footer>
                <Button onClick={this.hideModal}>Close</Button>
            </Modal.Footer>
        </Modal>
        </div>
    }
}

export default Options;