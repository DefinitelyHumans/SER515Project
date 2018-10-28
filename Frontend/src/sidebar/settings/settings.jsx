import React from 'react';

class Settings extends React.Component {

    constructor(props){
        super(props);
    }

    setting1(){

    }

    setting2(){

    }

    setting3(){

    }

    render(){
        return (<div className="Settings">
                <p>Settings:</p>
                <div><button className="SettingsOption" onClick={this.setting1}>Setting 1</button></div>
                <div><button className="SettingsOption" onClick={this.setting2}>Setting 2</button></div>
                <div><button className="SettingsOption" onClick={this.setting3}>Setting 3</button></div>
                </div>);
    }
}

export default Settings;