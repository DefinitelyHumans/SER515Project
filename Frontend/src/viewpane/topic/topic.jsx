import React from 'react';

class Topic extends React.Component {

    constructor(props){
        super(props);
        this.swapTopic = this.swapTopic.bind(this)
        this.renderTopicCard = this.renderTopicCard.bind(this)
        this.renderFullTopic = this.renderFullTopic.bind(this)
    }

    swapTopic(){
        this.props.parentSwapTopic(this.props.name);
    }

    renderTopicCard(){
        return (<button className="Topic" onClick={this.swapTopic}><p>{this.props.name}</p></button>);
    }

    renderFullTopic(){
        return (
                    <div className="FullTopic">
                        <div className="UpperContainer">
                            <button className="TopicExitButton" onClick={this.swapTopic}></button>
                            <button className="TopicExitButton" onClick={this.swapTopic}></button>
                        </div>
                        <div className="TopicUserProfile">
                            <div className="TopicUserImage"></div>
                            <p className="TopicUserInfo">Username</p>
                        </div>
                        <div>
                            <h1 className="TopicTitle">{this.props.name}</h1>
                            <p className="TopicDescription">Check out this nice description of this topic you created!</p>
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