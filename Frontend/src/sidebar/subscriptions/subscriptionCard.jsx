import React from 'react';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Panel } from 'react-bootstrap';
class SubscriptionCard extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (<Panel bsStyle="primary">
        <Panel.Heading>
            <Panel.Title componentClass="h2">This is a board</Panel.Title>
        </Panel.Heading>
        </Panel>);    
    }
}

export default SubscriptionCard;