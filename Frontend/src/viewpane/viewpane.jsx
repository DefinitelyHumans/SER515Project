import React from 'react';

import Topic from './topic/topic';

class Viewpane extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            topics:['A', 'B', 'C', 'D']
        }
        this.renderTopics = this.renderTopics.bind(this);
        this.addTopic = this.addTopic.bind(this);
    }

    renderTopics(){
        var tmp = this.state.topics.map((a) => <Topic key={a} name={a}></Topic>)
        return <div className="ViewPaneTopics">{tmp}</div>
    }

    addTopic(){
        let t = this.state.topics;
        t.push("new");
        this.setState({topics: t});
    }
    render(){
        let topicsView = this.renderTopics();
        return (<div className="ViewPane">
            {topicsView}
            <button className="ViewPane-Topic-Button" onClick={this.addTopic}>add topic</button>
        </div>);
    }
}

export default Viewpane;