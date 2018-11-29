import React from 'react';
import Modal from '../modal'
import Topic from './topic/topic';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Viewpane extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            singleTopicView: false,
            topics:[{'title': 'ATitle', 'descrip':'descripA', 'type':'link', 'user':'AUser'},
                {'title': 'B', 'descrip':'descripB', 'type':'link', 'user':'BUser'}],
            topic: {},
            comments: [
                {
                    'id': 'ATitle',
                    'comment': [
                        {
                            'user': 'userC',
                            'content': 'comment content',
                            'time': 'Dec. 1. 1989'
                        }]
                },
                {
                    'id': 'B',
                    'comment': []
                }],
            {'id': 'B', 'comment':[]}],
            inputTopicTitle: '',
            inputTopicContent: '',
            inputTopicType: '',
            visible: false
        }
        this.renderTopics = this.renderTopics.bind(this);
        this.swapTopic = this.swapTopic.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.saveTopic = this.saveTopic.bind(this);
        this.addComment = this.addComment.bind(this);
        this.createTopic = this.createTopic.bind(this);
        this.deleteTopic = this.deleteTopic.bind(this);
        this.updateTopic = this.updateTopic.bind(this);
        this.addComment = this.addComment.bind(this);
        this.deleteTopic = this.deleteTopic.bind(this);
        this.getUserCredentials = this.getUserCredentials.bind(this);
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
        let c = this.state.comments;
        c.push({'id': this.state.inputTopicTitle, 'comment':[]});
        this.setState({comments: c});
        NotificationManager.success('Topic '+this.state.inputTopicTitle +' is created.', 'Success');
        this.setState({inputTopicContent: '', inputTopicTitle: '', inputTopicType: ''});
        this.hideModal();
    }

    saveTopic() {
        let t = this.state.topics;
        t.push({ 'topic_title': this.state.inputTopicTitle, 'topic_content': this.state.inputTopicContent, 'user_posted': 'User', 'topic_type': this.state.inputTopicType });
        this.setState({ topics: t });
        let c = this.state.comments;
        c.push({ 'id': this.state.inputTopicTitle, 'comment': [] });
        this.setState({ comments: c });
        NotificationManager.success('Topic ' + this.state.inputTopicTitle + ' is created.', 'Success');
        this.setState({ inputTopicContent: '', inputTopicTitle: '', inputTopicType: '' });
        this.hideModal();
    }

    /**
     * For $GET requests for topics, the returned object is an array of objects.
     * Therefore, in promise, the returned object is parsed as json, to which another promise
     * will hold reference to viewpane class properties, and do a callback to iterate over each topic
     * object and store them in the topics array property.
     */
    getTopics() {
        const userID = this.state.user_session.user_id;
        const endpoint = 'http://localhost:3300/api/topic/user/' + userID;
        fetch(endpoint, {
            credentials: 'include',
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        }).then(response => response.json())
            .then(response => {
                let that = this;        // TODO: Fix call back referencing, this isn't the best means of accomplishing task.
                response.forEach(function (obj) {
                    // console.log("ITER",obj); 
                    let t = that.state.topics;
                    t.push(obj);
                    that.setState({ topics: t });
                    let c = that.state.comments;
                    c.push({ 'id': obj.topic_title, 'comment': [] });
                    that.setState({ comments: c });
                });
            })
    }

    /**
     * To get a topic, the ID must be passed, to which then a series of promises parse
     * response as json, and clone the topics array to append to it.
     */
    getTopic() {
        const topicID = "olupc254lfzwk6ohoesnspcyv7z9bl8q3fbq2x6od8d3wd8ochwl8q5wq04bns88";  // TODO: Retrieve
        const endpoint = 'http://localhost:3300/api/topic/' + topicID;
        // Convert response to JSON, and log out to screen.
        // }).then(response => {
        //     if (response.ok) {
        //         response.json().then(json => {
        //           console.log(json);
        //         });
        //     }
        // });
        fetch(endpoint, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        }).then(response => response.json())
            .then(response => {
                // console.log("Resp", response);
                let t = this.state.topics;
                t.push(response);
                this.setState({ topics: t });
                let c = this.state.comments;
                c.push({ 'id': response.topic_title, 'comment': [] });
                this.setState({ comments: c });
            }).catch(error => {
                return error;
            });
    }

    /**
     * TODO: Pass topic object as whole.
     * Delete takes a topic ID, or topic object, and hits the endpoint with user access token.
     * If response is valid, the topic object is located internally for topics array, and spliced away.
     */
    deleteTopic(topic_titleTemp) {
        const topic_title = "Bag of Chips";
        const topicID = "0uvoucfe3o2j0qi36bizy87t1e7ltieajt77kaewk4al2iwo8sx58obwxol6611s";
        const access_token = this.state.user_session.access_token;
        const endpoint = 'http://localhost:3300/api/topic/' + topicID;
        // const userID = "noua9p74ugz3shazx47j8795axqeoqp4"; 

        fetch(endpoint, {
            credentials: 'include',
            method: 'delete',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ "access_token": access_token })
        }).then(response => {
            if (response.ok) {
                // console.log("DELETE", response);
                let t = this.state.topics;
                // console.log("TOPICS", this.state.topics);
                // console.log("T", t);
                // var index = t.findIndex(x => x.topic_id === topicID);        // TODO: Utilize topic ID.
                var index = t.findIndex(x => x.topic_title === topic_title);
                // console.log("Location", index);
                if (index > -1) {   // Found index.
                    t.splice(index, 1);
                }
                this.setState({ topics: t });
            }
        });
    }

    /**
     * For $POST update, topic id is used to distinguish endpoint, and topic_content is included in body.
     * With valid response, internally, array is cloned, and distinctive topic object is located.
     * The topic property, topic_content, is updated, and restored to array.
     */
    updateTopic() {
        const topicID = "fjovljgljkgy85apml6al04rdu7tfyw6kgkhfluepmsadfr3eapztwdutl5yww5c";
        const endpoint = 'http://localhost:3300/api/topic/' + topicID;
        const topic_content = "change this bad boy away beyond the stars";
        const access_token = this.state.user_session.access_token;
        fetch(endpoint, {
            method: 'put',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ "topic_content": topic_content, "access_token": access_token })
        }).then(response => {
            // console.log("UPDATE",response);
            if (response.ok) {
                let t = this.state.topics;
                // console.log("T", t);
                var index = t.findIndex(x => x.topic_title === 'Nother Onel');      // Find index to retr obj, better than find.()
                // console.log("Location", index);
                if (index > -1) {   // Found index.
                    var tempTopic = t[index];                   // temporarily store topic object.
                    tempTopic.topic_content = topic_content;    // chagne property.
                    t[index] = tempTopic;   // update topic object.
                }
                this.setState({ topics: t });      
            }
            NotificationManager.success('Topic ' + this.state.inputTopicTitle + ' has been updated!', 'Success');
        }).catch(error => {
            return error;
        });
    }

    createTopic(e) {
        e.preventDefault();
        // console.log('calling login ' + this.state.userCred.email);
        const topic_title = this.state.inputTopicTitle;
        const topic_content = this.state.inputTopicContent;
        const topic_type = this.state.inputTopicType;
        // console.log("The type", topic_type);
        // TODO: Retrieve access token from login.
        // const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiemUxOWR4ajB0azRvZHI4Zng4dW01OTQzdDBmZWFrNzUiLCJpYXQiOjE1NDMxNzM3ODUsImV4cCI6MTU0MzE4ODE4NX0.DlnkU1x5IZuePxVqGCsV9Tn8L-y3zCMDb6676sow9ho";
        fetch('http://localhost:3300/api/topic/create', {
            credentials: 'include',
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "topic_title": topic_title,
                "topic_content": topic_content,
                "topic_type": topic_type,
                "access_token": this.state.user_session.access_token,
            })
        }).then(this.saveTopic());
        // }).then(console.log, this.saveTopic());
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
            let i;
            for (i=0; i < this.state.topics.length; i++){
                if (this.state.comments[i]['id'] === this.state.topic['title']){
                    break;
                }
            }
            tmp = <Topic key={this.state.topic['title']} topic={this.state.topic} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView} addComment={this.addComment} comment={this.state.comments[i]['comment']}></Topic>
        } else {
            tmp = this.state.topics.map((a) => <Topic key={a['title']} topic={a} parentSwapTopic={this.swapTopic} singleView={this.state.singleTopicView}></Topic>)
        }
        return <div className="ViewPaneTopics">{tmp}</div>
    }

    addComment(title, comment){
        let t = this.state.comments;
        let i;
        for (i=0; i < t.length; i++){
            if (t[i]['id'] === title){
                break;
            }
        }
        t[i]['comment'].push(comment);
        this.setState({comments: t});
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
                            <td><input type="text" name="TopicTitle" onChange={this.handleTitle.bind(this)} value={this.state.inputTopicTitle}/><br/></td></tr>
                        <tr className='dialogTopicContent'><td className='formDescrip'>Topic Content: </td>
                            <td><input type="text" name="TopicContent" onChange={this.handleContent.bind(this)} value={this.state.inputTopicContent}/><br/></td></tr>
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
            <NotificationContainer/>
        </div>);
    }
}

export default Viewpane;
