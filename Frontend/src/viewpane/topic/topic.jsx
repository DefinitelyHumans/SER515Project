import React from 'react';
import jQuery from 'jquery';
window.jQuery = jQuery;
require('bootstrap')
var FontAwesome = require('react-fontawesome');
import { Form, FormControl, Label, Input, Col, FormGroup, FormFeedback, HelpBlock,ControlLabel, Button} from 'reactstrap';
import { Panel, Well } from 'react-bootstrap';
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
            <Panel.Body>{this.props.topic['topic_title']}</Panel.Body>
        </Panel>)
        //return (<Button className="Topic" onClick={this.swapTopic}><p>{this.props.topic['topic_title']}</p></Button>);
    }

    renderComments(){
        if (this.props.comment !== {'content':''}){
            return this.props.comment.map((c) => {
                return (
                <Panel>
                    <Panel.Body>
                        <Well bsSize="small">{c['content']}</Well>
                    </Panel.Body>
                    <Panel.Footer>
                        <div className="CommentUserImage"></div>
                        <span className="CommentUserInfo">{c['user_posted']}</span>
                        <span className="CommentTime">{c['time']}</span>
                    </Panel.Footer>
                </Panel>)
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
                    <Panel bsStyle="primary">
                        <Panel.Heading>
                            {this.props.topic['topic_title']}
                        </Panel.Heading>
                        <Panel.Body>{this.props.topic['topic_content']}</Panel.Body>
                        <Panel.Footer>
                            {/* <Image src='' responsive circle/> */}
                            {this.props.topic['user_posted']}
                        </Panel.Footer>
                    </Panel>
                </div>
                <hr/>
                <div className='TopicComments'>
                    {this.renderComments()}
                    <Form className='CommentSubmission'>
                        <FormGroup>
                            <Label>Add a comment</Label>
                            <Input type="textarea" onChange={this.handleComment.bind(this)} value={this.state.newComment['content']}/>
                        </FormGroup>
                        <Button type='Button' onClick={this.handleSubmit.bind(this)} className="SubmitButton">Submit</Button>
                    </Form>
                </div>
                <Button className="TopicExitButton" onClick={this.swapTopic}>Return</Button>
            </div>
        );
    }

    render(){
        let view = this.props.singleView ? this.renderFullTopic() : this.renderTopicCard();
        return (view);
    }
}

export default Topic;