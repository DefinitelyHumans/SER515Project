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
            topicCards: [1,2,3,4, 5, 6],
            subsCards: [1,2,3],
            user_sess: {
                user_id: '',
                access_token: '',
            }
        }
        this.setUserCredentials = this.setUserCredentials.bind(this);
        this.muteChange = this.muteChange.bind(this);
    }

    setUserCredentials(user_sess) {
        this.state.user_sess = user_sess;
        // console.log("LOGIN GOTTEM", this.state.user_sess);
        this.props.parentUserCredentials(this.state.user_sess);
    }

    muteChange(){
        this.props.muteChange();
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
                <Login parentUserSession={this.setUserCredentials} userCredentials={this.state.user_sess} className="SidebarUserSignUp"/>
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
                        <Tab eventKey={2} title="Settings">
                            <Options mute={this.props.mute} muteChange={this.muteChange}></Options>
                        </Tab>
                    </Tabs>
                </Col>
            </div>);
    }
}

export default Sidebar;