import React from 'react';

import Topic from './topic/topic';

class Viewpane extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            topics:['A', 'B', 'C', 'D']
        }
        this.renderTopics = this.renderTopics.bind(this);
    }

    renderTopics(){
        var tmp = this.state.topics.map((a) => <Topic key={a} name={a}></Topic>)
        return <div className="ViewPaneTopics">{tmp}</div>
    }

    render(){
        return (<div className="ViewPane">
            <p>This is the viewpane panel</p>
            {this.renderTopics()}
        </div>);
    }
}

export default Viewpane;