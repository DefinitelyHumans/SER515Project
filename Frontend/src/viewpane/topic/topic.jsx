import React from 'react';


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
        return (<button className="Topic" onClick={this.swapTopic}><p>{this.props.topic['topic_title']}</p></button>);
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
                        <p>{c['content']}</p>
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
                    <button className="TopicExitButton" onClick={this.swapTopic}>Return</button>
                </div>
                <div className="TopicContainer">
                    <div className="TopicUserProfile">
                        <div className="TopicUserImage"></div>
                        <p className="TopicUserInfo">{this.props.topic['user_posted']}</p>
                    </div>
                    <div className="TopicContent">
                        <h1 className="TopicTitle">{this.props.topic['topic_title']}</h1>
                        <p className="TopicDescription">{this.props.topic['topic_content']}</p>
                    </div>
                </div>
                <hr/>
                <div className='TopicComments'>
                    {this.renderComments()}
                    <form className='CommentSubmission'>
                        <textarea className="CommentArea" rows="4" cols="60" onChange={this.handleComment.bind(this)} value={this.state.newComment['content']}></textarea>
                        <button type='button' onClick={this.handleSubmit.bind(this)} className="SubmitButton">Submit</button>
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