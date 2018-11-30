import React from 'react';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Form, FormControl, Label, Input, Col, FormGroup, FormFeedback, HelpBlock,ControlLabel, Button} from 'reactstrap';
import { Modal, Panel, Well, PageHeader } from 'react-bootstrap';
require('react-bootstrap')


class Topic extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            visible: false,
            newComment: {'content': ''}
        }
        this.swapTopic = this.swapTopic.bind(this);
        this.renderTopicCard = this.renderTopicCard.bind(this);
        this.renderFullTopic = this.renderFullTopic.bind(this);
        this.renderComments = this.renderComments.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.deleteTopic = this.deleteTopic.bind(this);
    }

    swapTopic(){
        this.props.parentSwapTopic(this.props.topic);
    }

    deleteTopic () {
        this.props.parentDeleteTopic(this.props.topic);
        this.hideModal();
        this.swapTopic();
    }

    showModal() {
        this.setState({ visible: true });
    }
    hideModal() {
        this.setState({ visible: false });
    }

    renderTopicCard(){

        return (<Panel className="flip-card" onClick={this.swapTopic}><Panel.Body className="flip-card-inner">
                <div className="flip-card-front" >
                    {this.props.topic['topic_title']}
                    </div>
                <div className="flip-card-back">{this.props.topic['topic_content']}
                </div>
            </Panel.Body></Panel>)
        //return (<Button className="Topic" onClick={this.swapTopic}><p>{this.props.topic['topic_title']}</p></Button>);
        //return (<button className="Topic" onClick={this.swapTopic}><p>{this.props.topic['topic_title']}</p></button>);
    }

    renderComments(){
        if (this.props.comment !== {'content':''}){
            return this.props.comment.map((c) => {
                return (<Panel>
                <Panel.Body className="CommentContent">
                        {c['content']}
                        <br/>
                        <small className="CommentUser"> {c['user']}</small>
                        <small className="CommentTime">{c['time']} | </small>
                </Panel.Body></Panel>)
            });
        }
    }

    handleSubmit(){
        if (this.state.newComment['content'] !== ''){
            this.props.addComment(this.props.topic['topic_title'], this.state.newComment);
            this.setState({newComment: {'content': ''}});
        }
    }

    handleComment(event){
        if (event.target.value != '')
            this.setState({newComment: {'id': this.props.topic['topic_title'], 'user': 'user', 'time': 'time', 'content': event.target.value}});
    }

    renderFullTopic(){
        return (
            <div className="FullTopic">
                <div className="TopicContainer">
                <PageHeader><Panel className="panel panel-primary">
                    <Panel.Heading className="FullTopicTitle">{this.props.topic['topic_title']}</Panel.Heading> 
                    <Panel.Body className="FullTopicContent">{this.props.topic['topic_content']}
                    <Panel.Footer className="TopicControl">
                            <Button className="TopicMoodButton">Like</Button>
                            <Button className="TopicMoodButton">Dislike</Button>
                            <Button className="TopicDelButton" onClick={this.showModal}>Delete</Button>
                    </Panel.Footer>
                   <small>{this.props.topic['user_posted']} </small>
                    </Panel.Body>
                    </Panel>
                    </PageHeader>
                </div>
                <div className='TopicComments'>
                    {this.renderComments()}
                    <Form className='CommentSubmission'>
                        <FormGroup>
                            <Input type="textarea" onChange={this.handleComment.bind(this)} value={this.state.newComment['content']}/>
                        </FormGroup>
                        <Button type='Button' onClick={this.handleSubmit.bind(this)} className="SubmitButton CommentButton"><span onClick={this.handleSubmit.bind(this)} className="glyphicon glyphicon-plus NewCommentIcon" aria-hidden="true"></span> Comment</Button>&nbsp;
                        <Button className="ReturnButton" onClick={this.swapTopic}>&laquo; Return</Button>
                    </Form>
                </div>
                
                <Modal show={this.state.visible} onHide={this.hideModal}>
                <Modal.Header>Remove Topic</Modal.Header>
                    <Modal.Body>Are you sure you would like to delete this topic?</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.deleteTopic} className="CommentButton">Yes</Button>
                        <Button onClick={this.hideModal}>No</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    render(){
        let view = this.props.singleView ? this.renderFullTopic() : this.renderTopicCard();
        return (view);
    }
}

export default Topic;