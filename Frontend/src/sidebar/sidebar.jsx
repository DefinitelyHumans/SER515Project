import React from 'react';
import Login from './../auth/login';
import TopicCard from './topics/topicCard';
import SubscriptionCard from './subscriptions/subscriptionCard';
import Options from './options'
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Form, FormControl, Label, Input, Col, FormGroup, FormFeedback, HelpBlock,ControlLabel, Button} from 'reactstrap';
import {Tabs, Tab } from 'react-bootstrap';
require('react-bootstrap')

class Sidebar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            settingsHidden: true,
            settings : {"Mute Notifications":true, "Report a Bug":true, "Delete Data":true},
            topicCards: [1,2,3,4, 5, 6],
            subsCards: [1,2,3]
        }
    }

    updateSettings(id){
        let dict = this.state.settings;
        dict[id] = !dict[id]
        this.setState({settings : dict})
    }
    render(){
        return (<div className="Sidebar">
                <div className="SidebarUserProfile">
                    <div className="SidebarUserImage"></div> {/*<Image src='../profileDefault.png' circle reactive */}
                </div>
                <Login className="SidebarUserSignUp"/>
                <Col md="12">
                    <input
                    className="form-control"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    />
                </Col>
                <Col sm={16}>
                    <Tabs defaultActiveKey={1} id="sidebartabs">
                        <Tab eventKey={1} title="Topics">
                            {this.state.topicCards.map((i) => <TopicCard></TopicCard>)}
                        </Tab>
                        <Tab eventKey={2} title="Boards">
                            {this.state.subsCards.map((i) => <SubscriptionCard></SubscriptionCard>)}
                        </Tab>
                        <Tab eventKey={3} title="Settings">
                            <Options></Options>
                        </Tab>
                    </Tabs>
                </Col>
            </div>);
    }
}

export default Sidebar;