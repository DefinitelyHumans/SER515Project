import React from 'react';

class Topic extends React.Component {

    constructor(props){
        super(props);
        this.swapTopic = this.swapTopic.bind(this)
        this.renderTopicCard = this.renderTopicCard.bind(this)
        this.renderFullTopic = this.renderFullTopic.bind(this)
    }

    swapTopic(){
        this.props.parentSwapTopic(this.props.topic);
    }

    renderTopicCard(){
        return (<button className="Topic" onClick={this.swapTopic}><p>{this.props.topic['title']}</p></button>);
    }

    renderFullTopic(){
        console.log(this.props.topic['user']);
        console.log(this.props.topic['title']);
        return (
                    <div className="FullTopic">
                        <div className="UpperContainer">
                            <button className="TopicExitButton" onClick={this.swapTopic}>Return to Main Board</button>
                        </div>
                        <div className="TopicUserProfile">
                            <div className="TopicUserImage"></div>
                            <p className="TopicUserInfo">{this.props.topic['user']}</p>
                        </div>
                        <div className="TopicContent">
                            <h1 className="TopicTitle">{this.props.topic['title']}</h1>
                            <p className="TopicDescription">{this.props.topic['descrip']}</p>
                        </div>
                        <div>
                            <textarea className="CommentArea" rows="4" cols="200">Comments can be made here!!</textarea>
                            <button className="SubmitButton">Submit</button>
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