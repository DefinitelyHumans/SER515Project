import React from 'react';
import Topic from './topic/topic';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Form, FormControl, Label, Input, Col, FormGroup, FormFeedback, HelpBlock,ControlLabel, Button} from 'reactstrap';
import {Modal, Tabs, Tab } from 'react-bootstrap';
require('react-bootstrap')
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Viewpane extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            singleTopicView: false,
            topics: [
                {
                    'topic_title': 'ATitle',
                    'topic_content': 'descripA',
                    'topic_type': 'link',
                    'user': 'AUser'
                },
                {
                    'topic_title': 'B',
                    'topic_content': 'descripB',
                    'topic_type': 'link',
                    'user': 'BUser'
                }],
            topic: {},
            comments: [
                {
                    'id': 'ATitle',
                    'comment': [
                        {
                            'user': 'userC',
                            'content': 'comment content',
                            'time': 'Dec. 1. 1989'
                        }]
                },
                {
                    'id': 'B',
                    'comment': []
                }],
            inputTopicTitle: '',
            inputTopicContent: '',
            inputTopicType: '',
            visible: false
        }
        this.renderTopics = this.renderTopics.bind(this);
        this.swapTopic = this.swapTopic.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.saveTopic = this.saveTopic.bind(this);
        this.addComment = this.addComment.bind(this);
    }

    showModal () {
        this.setState({visible: true});
    }
    hideModal () {
        this.setState({visible: false});
    }
    saveTopic(){
        if (this.state.inputTopicContent != '' && this.state.inputTopicTitle!= ''){
            let t = this.state.topics;
            t.push({'topic_title': this.state.inputTopicTitle, 'topic_content': this.state.inputTopicContent,'user': 'User', 'type': this.state.inputTopicType});
            this.setState({topics: t});
            let c = this.state.comments;
            c.push({'id': this.state.inputTopicTitle, 'comment':[]});
            this.setState({comments: c});
            NotificationManager.success('Topic '+this.state.inputTopicTitle +' is created.', 'Success');
            this.setState({inputTopicContent: '', inputTopicTitle: '', inputTopicType: ''});
            this.hideModal();
        }
    }

    handleTitle(event){
        this.setState({inputTopicTitle: event.target.value})
    }
    handleContent(event){
        this.setState({inputTopicContent: event.target.value})
    }
    handleSelect(event){
        this.setState({inputTopicType: event.target.value})
    }

    renderTopics(){
        var tmp
        if (this.state.singleTopicView){
            let i;
            for (i=0; i < this.state.topics.length; i++){
                if (this.state.comments[i]['id'] === this.state.topic['topic_title']){
                    break;
                }
            }
            tmp = <Topic key={this.state.topic['topic_title']} topic={this.state.topic} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView} addComment={this.addComment} comment={this.state.comments[i]['comment']}></Topic>
        } else {
            tmp = this.state.topics.map((a) => <Topic key={a['topic_title']} topic={a} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView}></Topic>)
        }
        return <div className="ViewPaneTopics">{tmp}</div>
    }

    addComment(title, comment){
        let t = this.state.comments;
        let i;
        for (i=0; i < t.length; i++){
            if (t[i]['id'] === title){
                break;
            }
        }
        t[i]['comment'].push(comment);
        this.setState({comments: t});
    }

    swapTopic(topic){
        this.setState({singleTopicView: !this.state.singleTopicView})
        this.setState({topic: topic})   
    }

    render(){
        let renderedTopics = this.renderTopics();
        let newButton = this.state.singleTopicView ? null : <Button className="ViewPane-Topic-Button" onClick={this.showModal}>Create New Topic</Button>;
        return (<div className="ViewPane">
            {renderedTopics}
            {newButton}
            <Modal show={this.state.visible} onHide={this.hideModal}>
                <Modal.Header>
                <Modal.Title>Create A Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <Label>Title</Label>
                            <Input
                                type="title"
                                name="Title"
                                required={true}
                                value={this.state.inputTopicTitle}
                                onChange={this.handleTitle.bind(this)}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Content</Label>
                            <Input
                                type="content"
                                name="Content"
                                required={true}
                                value={this.state.inputTopicContent}
                                onChange={this.handleContent.bind(this)}/>
                        </FormGroup> 
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={this.hideModal}>Close</Button>
                <Button onClick={this.saveTopic}>Create Topic</Button>
                </Modal.Footer>
            </Modal>
            <NotificationContainer/>
        </div>);
    }
}

export default Viewpane;