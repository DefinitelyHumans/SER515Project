import React from 'react';
import ReactDOM from 'react-dom';

import Sidebar from './sidebar/sidebar';
import ViewPane from './viewpane/viewpane';

class App extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (<div className="App">
            <Sidebar></Sidebar>
            <ViewPane className="viewpane"></ViewPane>
            </div>);

    }
}

export default App;