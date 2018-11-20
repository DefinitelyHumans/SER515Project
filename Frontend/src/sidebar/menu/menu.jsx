import React from 'react';
import TopicCard from './topics/topicCard';
import SubscriptionCard from './subscriptions/subscriptionCard';

class Menu extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            topicCards: [1,2,3,4, 5, 6],
            subsCards: [1,2,3],
            topicIsActive: true,
            tabClass: 'ActiveTab'
        }
        this.renderActiveTab = this.renderActiveTab.bind(this);
        this.activeTab = this.activeTab.bind(this)
    }

    activeTab(isActive){
        if (isActive)
            this.setState({topicIsActive: true});
        else
            this.setState({topicIsActive: false});
    }
    renderActiveTab(){
        let output;
        if (this.state.topicIsActive){
            output = this.state.topicCards.map((i) => <TopicCard></TopicCard>)
        }
        else{
            output = this.state.subsCards.map((i) => <SubscriptionCard></SubscriptionCard>)
        }
        return <div className="ActiveContent">{output}</div>
    }
    
    render(){
        return (<div className="Menu">
        <div className="Tabs">
            <button className={(this.state.topicIsActive) ? 'ActiveTab': 'InactiveTab'} onClick={()=>this.activeTab(true)}>Topics</button>
            <button className={(this.state.topicIsActive) ? 'InactiveTab' : 'ActiveTab'} onClick={()=>this.activeTab(false)}>Boards</button>
            </div>
            {this.renderActiveTab()}
            </div>);
    }
}

export default Menu;