import React from 'react';
import ReactDOM from 'react-dom';

import Sidebar from './sidebar/sidebar';
import ViewPane from './viewpane/viewpane';

//import './App.css';
class App extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (<div className="App">
            <Sidebar></Sidebar>
            <ViewPane></ViewPane>
            </div>);

    }
}

export default App;