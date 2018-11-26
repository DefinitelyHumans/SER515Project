import React from 'react';
import ReactDOM from 'react-dom';

import Sidebar from './sidebar/sidebar';
import ViewPane from './viewpane/viewpane';

class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
        	userDetails: {
        		loggedIn: false,
        		user_id: '',
        		email: '',
        		password: ''
        	}
        }
        this.handleUserDetails = this.handleUserDetails.bind(this); 
    }

    handleUserDetails(e){
    	this.setState({userDetails: e});
    }

    render(){
        return (<div className="App">
            <Sidebar handleUserDetails = {this.handleUserDetails}></Sidebar>
            <ViewPane className="viewpane"></ViewPane>
            </div>);

    }
}

export default App;