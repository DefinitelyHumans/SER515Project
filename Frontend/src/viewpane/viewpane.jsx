import React from 'react';

import Topic from './topic/topic';

class Viewpane extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            singleTopicView: false,
            topics:['A', 'B', 'C', 'D'],
            topic: "none"
        }
        this.renderTopics = this.renderTopics.bind(this);
        this.addTopic = this.addTopic.bind(this);
        this.swapTopic = this.swapTopic.bind(this);
    }

    renderTopics(){
        var tmp
        if (this.state.singleTopicView){
            tmp = <Topic key={this.state.topic} name={this.state.topic} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView}></Topic>
        } else {
            tmp = this.state.topics.map((a) => <Topic key={a} name={a} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView}></Topic>)
        }
        return <div className="ViewPaneTopics">{tmp}</div>
    }

    addTopic(){
        let t = this.state.topics;
        t.push("new");
        this.setState({topics: t});
    }

    swapTopic(name){
        this.setState({singleTopicView: !this.state.singleTopicView})
        this.setState({topic: name})
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