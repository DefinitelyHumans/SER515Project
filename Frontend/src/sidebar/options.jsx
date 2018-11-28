import React from 'react';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Form, FormControl, Label, Input, Col, FormGroup, FormFeedback, HelpBlock,ControlLabel, Button} from 'reactstrap';
import {Modal, Panel, Tabs, Tab } from 'react-bootstrap';

class Options extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            visible: false,
            message: ''
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.aboutMessage = "Welcome to CorkBoard. A Reddit/Slack clone made by Arizona State University students to practice AGILE development.";
        this.reportBugMessage = "Reporting a bug? Please go to https://github.com/DefinitelyHumans/SER515Project and submit an issue!";
        this.deleteMessage = "All your data has been deleted! -a feature still not yet functional";
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

    handleAbout(){
        this.setState({message: this.aboutMessage});
        this.showModal();
    }
    handleBugs(){
        this.setState({message: this.reportBugMessage});
        this.showModal();
    }

    handleDelete(){
        this.setState({message: this.deleteMessage});
        this.showModal();
    }

    handleData
    render(){
        return <div>
        <Panel bsStyle="primary" className="Option" onClick={this.handleAbout.bind(this)}>
            <Panel.Heading>
            <Panel.Title>About CorkBoard</Panel.Title>
            </Panel.Heading>
        </Panel>
        <Panel bsStyle="primary" className="Option" onClick={this.handleNotifs.bind(this)}>
            <Panel.Heading>
            <Panel.Title>Mute Notifications</Panel.Title>
            </Panel.Heading>
        </Panel>
        <Panel bsStyle="primary" className="Option" onClick={this.handleBugs.bind(this)}>
            <Panel.Heading>
            <Panel.Title>Report a Bug</Panel.Title>
            </Panel.Heading>
        </Panel>
        <Panel bsStyle="primary" className="Option" onClick={this.handleDelete.bind(this)}>
            <Panel.Heading>
            <Panel.Title>Delete Data</Panel.Title>
            </Panel.Heading>
        </Panel>

        <Modal show={this.state.visible} onHide={this.hideModal}>
            <Modal.Header>Cork Board</Modal.Header>
            <Modal.Body>{this.state.message}</Modal.Body>
            <Modal.Footer>
                <Button onClick={this.hideModal}>Close</Button>
            </Modal.Footer>
        </Modal>
        </div>
    }
}

export default Options;