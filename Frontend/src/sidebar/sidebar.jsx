import React from 'react';

import Menu from './menu/menu';
import Login from './../auth/login';
require('react-bootstrap');
import Settings from './settings/settings'

class Sidebar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            settingsHidden: true,
        }
        this.swapMenus = this.swapMenus.bind(this);
    }

    swapMenus(){
        this.setState({settingsHidden : !this.state.settingsHidden})
    }

    currentWindow(status){
        if (status){
            return <Menu></Menu>
        } else {
            return <Settings></Settings>
        }
    }

    render(){
        let settingText = this.state.settingsHidden ? "Settings" : "Exit";

        return (<div className="Sidebar">
                <div className="SidebarUserProfile">
                    <div className="SidebarUserImage"></div>
                </div>
                <Login className="SidebarUserSignUp"/>
                <input className="TopicSearch"></input>
                {this.currentWindow(this.state.settingsHidden)}
                <button className="SettingsButton" onClick={this.swapMenus}>{settingText}</button>
            </div>);
    }
}

export default Sidebar;