import React from 'react';
import Modal from '../modal'
import Topic from './topic/topic';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Button, FormControl, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap/lib/';

class Viewpane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            singleTopicView: false,
            topics: [{ 'title': 'ATitle', 'descrip': 'descripA', 'type': 'link', 'user': 'AUser' },
            { 'title': 'B', 'descrip': 'descripB', 'type': 'link', 'user': 'BUser' }],
            topic: {},
            comments: [{ 'id': 'ATitle', 'comment': [{ 'user': 'userC', 'content': 'comment content', 'time': 'Dec. 1. 1989' }] },
            { 'id': 'B', 'comment': [] }],
            inputTopicTitle: '',
            inputTopicContent: '',
            inputTopicType: 'text',
            visible: false
        }
        this.renderTopics = this.renderTopics.bind(this);
        this.swapTopic = this.swapTopic.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.saveTopic = this.saveTopic.bind(this);
        this.addComment = this.addComment.bind(this);
    }

    showModal() {
        this.setState({ visible: true });
    }
    hideModal() {
        this.setState({ visible: false });
    }
    saveTopic() {
        let t = this.state.topics;
        t.push({ 'title': this.state.inputTopicTitle, 'descrip': this.state.inputTopicContent, 'user': 'User', 'type': this.state.inputTopicType });
        this.setState({ topics: t });
        let c = this.state.comments;
        c.push({ 'id': this.state.inputTopicTitle, 'comment': [] });
        this.setState({ comments: c });
        NotificationManager.success('Topic ' + this.state.inputTopicTitle + ' is created.', 'Success');
        this.setState({ inputTopicContent: '', inputTopicTitle: '', inputTopicType: '' });
        this.hideModal();
    }

    handleSubmit(e) {
        e.preventDefault();
        // console.log('calling login ' + this.state.userCred.email);
        const topic_title = this.state.inputTopicTitle;
        const topic_content = this.state.inputTopicContent;
        const topic_type = this.state.inputTopicType;
        console.log("The type", topic_type);
        const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibm91YTlwNzR1Z3ozc2hheng0N2o4Nzk1YXhxZW9xcDQiLCJpYXQiOjE1NDI5MjAwMzQsImV4cCI6MTU0MjkzNDQzNH0.SgNf4BDgPBvXdlIh-_bY_3EbwHu2dVjROck9JZOp_os";
        fetch('http://localhost:3300/api/topic/create', {
            credentials: 'include',
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ "topic_title": topic_title, "topic_content": topic_content, "topic_type": topic_type, "access_token": access_token})
        }).then(console.log, this.saveTopic());
    }

    handleTitle(event) {
        this.setState({ inputTopicTitle: event.target.value })
    }
    handleContent(event) {
        this.setState({ inputTopicContent: event.target.value })
    }
    handleSelect(event) {
        console.log('change', this.inputEl )
        this.setState({ inputTopicType: this.inputEl.value })
    }

    renderTopics() {
        var tmp
        if (this.state.singleTopicView) {
            let i;
            for (i = 0; i < this.state.topics.length; i++) {
                if (this.state.comments[i]['id'] === this.state.topic['title']) {
                    break;
                }
            }
            tmp = <Topic key={this.state.topic['title']} topic={this.state.topic} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView} addComment={this.addComment} comment={this.state.comments[i]['comment']}></Topic>
        } else {
            tmp = this.state.topics.map((a) => <Topic key={a['title']} topic={a} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView}></Topic>)
        }
        return <div className="ViewPaneTopics">{tmp}</div>
    }

    addComment(title, comment) {
        let t = this.state.comments;
        let i;
        for (i = 0; i < t.length; i++) {
            if (t[i]['id'] === title) {
                break;
            }
        }
        t[i]['comment'].push(comment);
        this.setState({ comments: t });
    }

    swapTopic(topic) {
        this.setState({ singleTopicView: !this.state.singleTopicView })
        this.setState({ topic: topic })
    }

    getValidationStateTitle() {
        const length = this.state.inputTopicTitle.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    getValidationStateContent() {
        const length = this.state.inputTopicContent.length;
        if (length > 40 && length < 250) return 'success';
        return null;
    }


    render() {
        let renderedTopics = this.renderTopics();
        let newButton = this.state.singleTopicView ? null : <button className="ViewPane-Topic-Button" onClick={this.showModal}>add topic</button>;
        return (<div className="ViewPane">
            {renderedTopics}
            {newButton}
            <Modal visible={this.state.visible}>
                {/* <Modal
                show={this.state.visible}
                onHide={this.hideModal}
            > */}
                <h2 className="dialogTitle">Create Topic</h2>
                <form>
                    <FormGroup
                        controlId="formTitle"
                        validationState={this.getValidationStateTitle()}
                    >
                        <ControlLabel>Topic title</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.inputTopicTitle}
                            placeholder="Enter topic title"
                            onChange={this.handleTitle.bind(this)} value={this.state.inputTopicTitle}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Validation is based on string length.</HelpBlock>
                    </FormGroup>
                    {/* Topic Content Section */}
                    <FormGroup
                        controlId="formContent"
                        validationState={this.getValidationStateContent()}
                    >
                        <ControlLabel>Topic Content</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.inputTopicContent}
                            placeholder="Enter topic content"
                            onChange={this.handleContent.bind(this)}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Validation is based on string length.</HelpBlock>
                    </FormGroup>
                    {/* Select Type */}
                    <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Select</ControlLabel>
                        <FormControl
                            componentClass="select"
                            placeholder="select"
                            inputRef={ el => this.inputEl=el }
                            onChange={this.handleSelect.bind(this)}
                        >
                            <option value="text">Text</option>
                            <option value="link">Link</option>
                            <option value="image">Image</option>
                        </FormControl>
                    </FormGroup>
                </form>
                <Button bsStyle="danger" onClick={this.hideModal} type="button" className="closeDialogButton">Cancel</Button>
                {/* <Button bsStyle="success" onClick={this.saveTopic} type="button" className="closeDialogButton">Submit</Button> */}
                <Button bsStyle="success" onClick={this.handleSubmit} type="button" className="closeDialogButton">Submit</Button>
            </Modal>
            <NotificationContainer />
        </div>);
    }
}

export default Viewpane;