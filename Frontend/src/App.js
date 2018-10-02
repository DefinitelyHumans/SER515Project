import React from 'react';
import ReactDOM from 'react-dom';
import TabbedPanels from './components/sidebar/TabbedPanels';

class App extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (<TabbedPanels></TabbedPanels>);
    }
}

export default App;