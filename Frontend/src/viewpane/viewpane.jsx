import React from 'react';

import Topic from './topic/topic';

class Viewpane extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            singleTopicView: false,
            topics:[{'title': 'ATitle', 'user':'AUser'}, {'title': 'B', 'user':'BUser'}, {'title': 'C', 'user':'CUser'}, {'title': 'D', 'user':'DUser'}],
            topic: {}
        }
        this.renderTopics = this.renderTopics.bind(this);
        this.addTopic = this.addTopic.bind(this);
        this.swapTopic = this.swapTopic.bind(this);
    }

    renderTopics(){
        var tmp
        if (this.state.singleTopicView){
            tmp = <Topic key={this.state.topic['title']} topic={this.state.topic} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView}></Topic>
        } else {
            tmp = this.state.topics.map((a) => <Topic key={a['title']} topic={a} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView}></Topic>)
        }
        return <div className="ViewPaneTopics">{tmp}</div>
    }

    addTopic(){
        let t = this.state.topics;
        t.push("new");
        this.setState({topics: t});
    }

    swapTopic(topic){
        this.setState({singleTopicView: !this.state.singleTopicView})
        this.setState({topic: topic})
    }

    render(){
        let renderedTopics = this.renderTopics();
        let newButton = this.state.singleTopicView ? null : <button className="ViewPane-Topic-Button" onClick={this.addTopic}>add topic</button>;
        return (<div className="ViewPane">
            {renderedTopics}
            {newButton}
        </div>);
    }
}

export default Viewpane;