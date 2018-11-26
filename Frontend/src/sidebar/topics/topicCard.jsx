import React from 'react';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Panel } from 'react-bootstrap';
class TopicCard extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (<Panel bsStyle="primary">
        <Panel.Heading>
            <Panel.Title componentClass="h2">This is a topic</Panel.Title>
        </Panel.Heading>
        </Panel>);
    }
}

export default TopicCard;