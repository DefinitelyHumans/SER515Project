import React from 'react';
import Topic from './topic/topic';
import jQuery from 'jquery';
window.jQuery = jQuery;
// require('bootstrap')
var FontAwesome = require('react-fontawesome');
// import { Form, FormControl, Label, Input, Col, FormGroup, FormFeedback, HelpBlock,ControlLabel, Button} from 'reactstrap';
import {Modal, Tabs, Tab } from 'react-bootstrap';
require('react-bootstrap')
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Button, FormControl, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap/lib/';
// import { Button, FormControl, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';

class Viewpane extends React.Component {

    constructor(props) {
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
            inputTopicType: 'text',
            visible: false,
            user_session: {
                user_id: '',
                access_token: '',
            },
        }
        this.renderTopics = this.renderTopics.bind(this);
        this.swapTopic = this.swapTopic.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.getTopic = this.getTopic.bind(this);
        this.saveTopic = this.saveTopic.bind(this);
        this.createTopic = this.createTopic.bind(this);
        this.deleteTopic = this.deleteTopic.bind(this);
        this.updateTopic = this.updateTopic.bind(this);
        this.addComment = this.addComment.bind(this);
        this.deleteTopic = this.deleteTopic.bind(this);
        // Parent from app
        this.getUserCredentials = this.getUserCredentials.bind(this);
    }

    /**
     * Invoked immediately after a component is mounted (inserted into the tree). 
     * Initialization that requires DOM nodes should go here. If you need to load data 
     * from a remote endpoint, this is a good place to instantiate the network request.
     */
    componentDidMount() {
        // let topic = this.getTopic();
        // let topics = this.getTopics();
    }

    showModal() {
        this.setState({ visible: true });
    }
    hideModal() {
        this.setState({ visible: false });
    }

    getUserCredentials() {
        let uSess = this.props.parentUserCredentials();
        // console.log("USESS", uSess);
        this.setState({ user_session: uSess}, () => {
            // console.log("USER", this.state.user_session);
            this.getTopics();
        });
    }

  
//     saveTopic(){
//         if (this.state.inputTopicContent != '' && this.state.inputTopicTitle!= ''){
//             let t = this.state.topics;
//             t.push({'topic_title': this.state.inputTopicTitle, 'topic_content': this.state.inputTopicContent,'user': 'User', 'type': this.state.inputTopicType});
//             this.setState({topics: t});
//             let c = this.state.comments;
//             c.push({'id': this.state.inputTopicTitle, 'comment':[]});
//             this.setState({comments: c});
//             NotificationManager.success('Topic '+this.state.inputTopicTitle +' is created.', 'Success');
//             this.setState({inputTopicContent: '', inputTopicTitle: '', inputTopicType: ''});
//             this.hideModal();
//         }

    saveTopic() {
        let t = this.state.topics;
        t.push({ 'topic_title': this.state.inputTopicTitle, 'topic_content': this.state.inputTopicContent, 'user_posted': 'User', 'topic_type': this.state.inputTopicType });
        this.setState({ topics: t });
        let c = this.state.comments;
        c.push({ 'id': this.state.inputTopicTitle, 'comment': [] });
        this.setState({ comments: c });
        NotificationManager.success('Topic ' + this.state.inputTopicTitle + ' is created.', 'Success');
        this.setState({ inputTopicContent: '', inputTopicTitle: '', inputTopicType: '' });
        this.hideModal();
    }

    /**
     * For $GET requests for topics, the returned object is an array of objects.
     * Therefore, in promise, the returned object is parsed as json, to which another promise
     * will hold reference to viewpane class properties, and do a callback to iterate over each topic
     * object and store them in the topics array property.
     */
    getTopics() {
        const userID = this.state.user_session.user_id;
        const endpoint = 'http://localhost:3300/api/topic/user/' + userID;
        fetch(endpoint, {
            credentials: 'include',
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        }).then(response => response.json())
            .then(response => {
                let that = this;        // TODO: Fix call back referencing, this isn't the best means of accomplishing task.
                response.forEach(function (obj) {
                    // console.log("ITER",obj); 
                    let t = that.state.topics;
                    t.push(obj);
                    that.setState({ topics: t });
                    let c = that.state.comments;
                    c.push({ 'id': obj.topic_title, 'comment': [] });
                    that.setState({ comments: c });
                });
            })
    }

    /**
     * To get a topic, the ID must be passed, to which then a series of promises parse
     * response as json, and clone the topics array to append to it.
     */
    getTopic() {
        const topicID = "olupc254lfzwk6ohoesnspcyv7z9bl8q3fbq2x6od8d3wd8ochwl8q5wq04bns88";  // TODO: Retrieve
        const endpoint = 'http://localhost:3300/api/topic/' + topicID;
        // Convert response to JSON, and log out to screen.
        // }).then(response => {
        //     if (response.ok) {
        //         response.json().then(json => {
        //           console.log(json);
        //         });
        //     }
        // });
        fetch(endpoint, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        }).then(response => response.json())
            .then(response => {
                // console.log("Resp", response);
                let t = this.state.topics;
                t.push(response);
                this.setState({ topics: t });
                let c = this.state.comments;
                c.push({ 'id': response.topic_title, 'comment': [] });
                this.setState({ comments: c });
            }).catch(error => {
                return error;
            });
    }

    /**
     * TODO: Pass topic object as whole.
     * Delete takes a topic ID, or topic object, and hits the endpoint with user access token.
     * If response is valid, the topic object is located internally for topics array, and spliced away.
     */
    deleteTopic(topic_titleTemp) {
        const topic_title = "Bag of Chips";
        const topicID = "0uvoucfe3o2j0qi36bizy87t1e7ltieajt77kaewk4al2iwo8sx58obwxol6611s";
        const access_token = this.state.user_session.access_token;
        const endpoint = 'http://localhost:3300/api/topic/' + topicID;
        // const userID = "noua9p74ugz3shazx47j8795axqeoqp4"; 

        fetch(endpoint, {
            credentials: 'include',
            method: 'delete',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ "access_token": access_token })
        }).then(response => {
            if (response.ok) {
                // console.log("DELETE", response);
                let t = this.state.topics;
                // console.log("TOPICS", this.state.topics);
                // console.log("T", t);
                // var index = t.findIndex(x => x.topic_id === topicID);        // TODO: Utilize topic ID.
                var index = t.findIndex(x => x.topic_title === topic_title);
                // console.log("Location", index);
                if (index > -1) {   // Found index.
                    t.splice(index, 1);
                }
                this.setState({ topics: t });
            }
        });
    }

    /**
     * For $POST update, topic id is used to distinguish endpoint, and topic_content is included in body.
     * With valid response, internally, array is cloned, and distinctive topic object is located.
     * The topic property, topic_content, is updated, and restored to array.
     */
    updateTopic() {
        const topicID = "fjovljgljkgy85apml6al04rdu7tfyw6kgkhfluepmsadfr3eapztwdutl5yww5c";
        const endpoint = 'http://localhost:3300/api/topic/' + topicID;
        const topic_content = "change this bad boy away beyond the stars";
        const access_token = this.state.user_session.access_token;
        fetch(endpoint, {
            method: 'put',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ "topic_content": topic_content, "access_token": access_token })
        }).then(response => {
            // console.log("UPDATE",response);
            if (response.ok) {
                let t = this.state.topics;
                // console.log("T", t);
                var index = t.findIndex(x => x.topic_title === 'Nother Onel');      // Find index to retr obj, better than find.()
                // console.log("Location", index);
                if (index > -1) {   // Found index.
                    var tempTopic = t[index];                   // temporarily store topic object.
                    tempTopic.topic_content = topic_content;    // chagne property.
                    t[index] = tempTopic;   // update topic object.
                }
                this.setState({ topics: t });      
            }
            NotificationManager.success('Topic ' + this.state.inputTopicTitle + ' has been updated!', 'Success');
        }).catch(error => {
            return error;
        });
    }

    /**
     * For Creating topic ($POST), the body requests title, content, type, and token. 
     * With the promise, the saveTopic function is called which updates internal arrays and gives user a notification
     * bar for valid topic creation. Returned is the topic_id upon creation.
     * @param {event} e 
     */
    createTopic(e) {
        e.preventDefault();
        // console.log('calling login ' + this.state.userCred.email);
        const topic_title = this.state.inputTopicTitle;
        const topic_content = this.state.inputTopicContent;
        const topic_type = this.state.inputTopicType;
        // console.log("The type", topic_type);
        // TODO: Retrieve access token from login.
        // const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiemUxOWR4ajB0azRvZHI4Zng4dW01OTQzdDBmZWFrNzUiLCJpYXQiOjE1NDMxNzM3ODUsImV4cCI6MTU0MzE4ODE4NX0.DlnkU1x5IZuePxVqGCsV9Tn8L-y3zCMDb6676sow9ho";
        fetch('http://localhost:3300/api/topic/create', {
            credentials: 'include',
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "topic_title": topic_title,
                "topic_content": topic_content,
                "topic_type": topic_type,
                "access_token": this.state.user_session.access_token,
            })
        }).then(this.saveTopic());
        // }).then(console.log, this.saveTopic());
    }

    handleTitle(event) {
        this.setState({ inputTopicTitle: event.target.value })
    }
    handleContent(event) {
        this.setState({ inputTopicContent: event.target.value })
    }
    handleSelect(event) {
        // console.log('change', this.inputEl)
        this.setState({ inputTopicType: this.inputEl.value })
    }

    renderTopics() {
        var tmp
        if (this.state.singleTopicView) {
            let i;
            for (i = 0; i < this.state.topics.length; i++) {
                if (this.state.comments[i]['id'] === this.state.topic['topic_title']) {
                    break;
                }
            }
            tmp = <Topic key={this.state.topic['topic_title']} topic={this.state.topic} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView} addComment={this.addComment} comment={this.state.comments[i]['comment']} parentDeleteTopic={this.deleteTopic}></Topic>
        } else {
            tmp = this.state.topics.map((a) => <Topic key={a['topic_title']} topic={a} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView}></Topic>)
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

    /**
     * Validate number of characters entered for title.
     */
    getValidationStateTitle() {
        const length = this.state.inputTopicTitle.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    /**
     * Validate sufficient characters are entered for topic content.
     */
    getValidationStateContent() {
        const length = this.state.inputTopicContent.length;
        if (length > 40 && length < 250) return 'success';
        return null;
    }

    /**
     * React Bootstrap component used from the Forms section of react-bootstrap online API.
     */
    render() {
        let renderedTopics = this.renderTopics();

        //  let newButton = this.state.singleTopicView ? null : <Button className="ViewPane-Topic-Button" onClick={this.showModal}><span className="glyphicon glyphicon-plus NewPlusIcon" aria-hidden="true"></span> Create New Topic</Button>;
        // return (<div className="ViewPane">
        //      {renderedTopics}
        //      {newButton}
        //     <Modal show={this.state.visible} onHide={this.hideModal}>
        //         <Modal.Header>
        //         <Modal.Title>Create A Topic</Modal.Title>
        //         </Modal.Header>
        //         <Modal.Body>
        //             <Form>
        //                 <FormGroup>
        //                     <Label>Title</Label>
        //                     <Input
        //                         type="title"
        //                         name="Title"
        //                         required={true}
        //                         value={this.state.inputTopicTitle}
        //                         onChange={this.handleTitle.bind(this)}/>
        //                 </FormGroup>
        //                 <FormGroup>
        //                     <Label>Content</Label>
        //                     <Input
        //                         type="content"
        //                         name="Content"
        //                         required={true}
        //                         value={this.state.inputTopicContent}
        //                         onChange={this.handleContent.bind(this)}/>
        //                 </FormGroup> 
        //             </Form>
        //         </Modal.Body>
        //         <Modal.Footer>
        //         <Button onClick={this.hideModal}>Close</Button>
        //         <Button className="btn btn-success" onClick={this.saveTopic}>Create Topic</Button>
        //         </Modal.Footer> 

        // console.log("TOPICS", this.state.topics);
        // let newButton = this.state.singleTopicView ? null : <button className="ViewPane-Topic-Button" onClick={this.updateTopic}>add topic</button>;
        // let newButton = this.state.singleTopicView ? null : <button className="ViewPane-Topic-Button" onClick={this.showModal}>add topic</button>;
        let newButton = this.state.singleTopicView ? null : <Button className="ViewPane-Topic-Button" onClick={this.showModal}><span className="glyphicon glyphicon-plus NewPlusIcon" aria-hidden="true"></span> Create New Topic</Button>;

        return (<div className="ViewPane">
            <div>
                {/* <h1>HEREEEE</h1> */}
                <Button bsStyle="primary" onClick={this.getUserCredentials}><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>Update</Button>
            </div>
            {renderedTopics}
            {newButton}
                <Modal show={this.state.visible} onHide={this.hideModal}>
                 <Modal.Header>
                 <Modal.Title>Create A Topic</Modal.Title>
                 </Modal.Header>
                 <Modal.Body>
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
                            inputRef={el => this.inputEl = el}
                            onChange={this.handleSelect.bind(this)}
                        >
                            <option value="text">Text</option>
                            <option value="link">Link</option>
                            <option value="image">Image</option>
                        </FormControl>
                    </FormGroup>
                </form>
                </Modal.Body>
                <Modal.Footer>
                <Button bsStyle="danger" onClick={this.hideModal} type="button" className="closeDialogButton">Cancel</Button>
                <Button bsStyle="success" onClick={this.createTopic} type="button" className="closeDialogButton">Submit</Button>
                {/* <Button bsStyle="success" onClick={this.saveTopic} type="button" className="closeDialogButton">Submit</Button> */}
                </Modal.Footer>
                </Modal>
            <NotificationContainer />
        </div>);
    }
}

export default Viewpane;

