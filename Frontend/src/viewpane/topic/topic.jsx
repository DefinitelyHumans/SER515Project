import React from 'react';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Form, FormControl, Label, Input, Col, FormGroup, FormFeedback, HelpBlock,ControlLabel, Button} from 'reactstrap';
import { Panel, Well, PageHeader } from 'react-bootstrap';
require('react-bootstrap')


class Topic extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            newComment: {'content': ''}
        }
        this.swapTopic = this.swapTopic.bind(this);
        this.renderTopicCard = this.renderTopicCard.bind(this);
        this.renderFullTopic = this.renderFullTopic.bind(this);
        this.renderComments = this.renderComments.bind(this);

    }

    swapTopic(){
        this.props.parentSwapTopic(this.props.topic);
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
            <div className="UpperContainer">
                    <button className="TopicExitButton" onClick={this.swapTopic}>Return</button>
                </div>
                <div className="TopicContainer">
                <PageHeader><Panel className="panel panel-primary">
                    <Panel.Heading className="FullTopicTitle">{this.props.topic['topic_title']}</Panel.Heading> 
                    <Panel.Body className="FullTopicContent">{this.props.topic['topic_content']}
                   <small>{this.props.topic['user_posted']} </small>
                    </Panel.Body>
                    </Panel>
                    </PageHeader>
                    <div className="TopicUserProfile">
                        <div className="TopicUserImage"></div>
                        <p className="TopicUserInfo">{this.props.topic['user_posted']}</p>
                    </div>
                    <div className="TopicContent">
                        <h1 className="TopicTitle">{this.props.topic['topic_title']}</h1>
                        <p className="TopicDescription">{this.props.topic['topic_content']}</p>
                    </div>
                </div>
                
            </div>
        );
    }

    render(){
        let view = this.props.singleView ? this.renderFullTopic() : this.renderTopicCard();
        return (view);
    }
}

export default Topic;