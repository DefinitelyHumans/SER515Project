import React from 'react';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Form, FormControl, Label, Input, Col, FormGroup, FormFeedback, HelpBlock,ControlLabel, Button} from 'reactstrap';
import { Tabs, Tab, Panel, Well } from 'react-bootstrap';
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
        return (<Panel onClick={this.swapTopic}>
            <Panel.Body>{this.props.topic['title']}</Panel.Body>
        </Panel>)
        //return (<Button className="Topic" onClick={this.swapTopic}><p>{this.props.topic['title']}</p></Button>);
    }

    renderComments(){
        if (this.props.comment !== {'content':''}){
            return this.props.comment.map((c) => {
                return (
                <div className="Comment">
                    <div className="CommentUserProfile">
                        <div className="CommentUserImage"></div>
                        <p className="CommentUserInfo">{c['user']}</p>
                    </div>
                    <div className="CommentContent">
                        <Well bsSize="small">{c['content']}</Well>
                    </div>
                    <div className="CommentStats">
                        <p className="CommentTime">{c['time']}</p>
                    </div>
                </div>)
            });
        }
    }

    handleSubmit(){
        if (this.state.newComment['content'] !== ''){
            this.props.addComment(this.props.topic['title'], this.state.newComment);
            this.setState({newComment: {'content': ''}});
        }
    }

    handleComment(event){
        if (event.target.value != '')
            this.setState({newComment: {'id': this.props.topic['title'], 'user': 'user', 'time': 'time', 'content': event.target.value}});
    }

    renderFullTopic(){
        return (
            <div className="FullTopic">
                <div className="UpperContainer">
                    <Button className="TopicExitButton" onClick={this.swapTopic}>Return</Button>
                </div>
                <div className="TopicContainer">
                    <Panel bsStyle="primary">
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">{this.props.topic['title']}</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>{this.props.topic['descrip']}</Panel.Body>
                        <Panel.Footer>
                            {/* <Image src='' responsive circle/> */}
                            {this.props.topic['user']}
                        </Panel.Footer>
                    </Panel>
                </div>
                <hr/>
                <div className='TopicComments'>
                    {this.renderComments()}
                    <form className='CommentSubmission'>
                        <textarea className="CommentArea" rows="4" cols="60" onChange={this.handleComment.bind(this)} value={this.state.newComment['content']}></textarea>
                        <Button type='Button' onClick={this.handleSubmit.bind(this)} className="SubmitButton">Submit</Button>
                    </form>
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