import React from 'react';
import ReactDOM from 'react-dom';

import Sidebar from './sidebar/sidebar';
import ViewPane from './viewpane/viewpane';

class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user_session: {
                user_id: '',
                access_token: '',
            },
            mute: false
        }
        this.getUserCredentials = this.getUserCredentials.bind(this);
        this.setUserCredentials = this.setUserCredentials.bind(this);
        this.handleMuteChange = this.handleMuteChange.bind(this);
    }

    getUserCredentials() {
        let user_session = { 
            user_id: this.state.user_session.user_id, 
            access_token: this.state.user_session.access_token
        };
        return user_session;
    }

    setUserCredentials(user) {
        // console.log("COME UP", user);
        this.setState({user_session: user});
    }

    handleMuteChange(){
        this.setState({mute: !this.state.mute});
    }
    render(){
        return (<div className="App">
            <Sidebar parentUserCredentials={this.setUserCredentials} userCredentials={this.state.user_session} muteChange={this.handleMuteChange} mute={this.state.mute}></Sidebar>
            <ViewPane parentUserCredentials={this.getUserCredentials} className="viewpane" mute={this.state.mute}></ViewPane>
            </div>);

    }
}

export default App;