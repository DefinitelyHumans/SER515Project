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
            }
        }
        this.getUserCredentials = this.getUserCredentials.bind(this);
        this.setUserCredentials = this.setUserCredentials.bind(this);
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

    render(){
        return (<div className="App">
            <Sidebar parentUserCredentials={this.setUserCredentials} userCredentials={this.state.user_session}></Sidebar>
            {/* <Sidebar></Sidebar> */}
            <ViewPane parentUserCredentials={this.getUserCredentials} className="viewpane"></ViewPane>
            </div>);

    }
}

export default App;