import React from 'react';
import Modal from '../modal'
import Topic from './topic/topic';


class Viewpane extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            singleTopicView: false,
            topics:[{'title': 'ATitle', 'descrip':'descripA', 'type':'link', 'user':'AUser', 'comments': [{'id': 0, 'user': 'user', 'content': 'comment content', 'time': 'Dec. 1. 1989'}]}, 
                {'title': 'B', 'descrip':'descripB', 'type':'link', 'user':'BUser', 'comments': [{'id': 0, 'user': 'user', 'content': 'comment content', 'time': 'Dec. 1. 1989'}]}],
            topic: {},
            inputTopicTitle: 'Title',
            inputTopicContent: 'Content',
            inputTopicType: 'Type',
            visible: false
        }
        this.renderTopics = this.renderTopics.bind(this);
        this.swapTopic = this.swapTopic.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.saveTopic = this.saveTopic.bind(this);
        this.addComment = this.addComment.bind(this);
    }

    showModal () {
        this.setState({visible: true});
    }
    hideModal () {
        this.setState({visible: false});
    }
    saveTopic(){
        let t = this.state.topics;
        t.push({'title': this.state.inputTopicTitle, 'descrip': this.state.inputTopicContent,'user': 'User', 'type': this.state.inputTopicType});
        this.setState({topics: t});
        this.hideModal();
    }

    handleTitle(event){
        this.setState({inputTopicTitle: event.target.value})
    }
    handleContent(event){
        this.setState({inputTopicContent: event.target.value})
    }
    handleSelect(event){
        this.setState({inputTopicType: event.target.value})
    }

    renderTopics(){
        var tmp
        if (this.state.singleTopicView){
            tmp = <Topic key={this.state.topic['title']} topic={this.state.topic} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView} addComment={this.addComment}></Topic>
        } else {
            tmp = this.state.topics.map((a) => <Topic key={a['title']} topic={a} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView}></Topic>)
        }
        return <div className="ViewPaneTopics">{tmp}</div>
    }

    addComment(topic, comment){
        let i;
        console.log(this.state.topics.length);
        for (i=0; i < this.state.topics.length; i++){
            console.log(this.state.topics[i])
            if (this.state.topics[i]['title'] == topic['title'])
              break;  
        }
        console.log(i);
        let nextId = this.state.topics[i]['comments'].length;
        comment['id'] = nextId;
        let t = this.state.topics;
        t[i]['comments'].push(comment);
        this.setState({topics: t});
    }

    swapTopic(topic){
        this.setState({singleTopicView: !this.state.singleTopicView})
        this.setState({topic: topic})
    }

    render(){
        let renderedTopics = this.renderTopics();
        let newButton = this.state.singleTopicView ? null : <button className="ViewPane-Topic-Button" onClick={this.showModal}>add topic</button>;
        return (<div className="ViewPane">
            {renderedTopics}
            {newButton}
            <Modal visible={this.state.visible}>
                <h3 className="dialogTitle">Create a topic</h3>
                <form>
                    <table>
                        <tr className='dialogTopicTitle'><td className='formDescrip'>Topic Title: </td>
                            <td><input type="text" name="TopicTitle" onChange={this.handleTitle.bind(this)}/><br/></td></tr>
                        <tr className='dialogTopicContent'><td className='formDescrip'>Topic Content: </td>
                            <td><input type="text" name="TopicContent" onChange={this.handleContent.bind(this)}/><br/></td></tr>
                        <tr><td className='formDescrip'>Topic Type:</td>
                            <td><select onChange={this.handleSelect.bind(this)}>
                                <option value="text">Text</option>
                                <option value="link">Link</option>
                                <option value="image">Image</option>
                            </select></td></tr>
                    </table> 
                </form>
                <button onClick={this.hideModal} type="button" className="closeDialogButton">Cancel</button>
                <button onClick={this.saveTopic} type="button" className="closeDialogButton">Create Topic</button>
            </Modal>
        </div>);
    }
}

export default Viewpane;