import React from 'react';

import Menu from './menu/menu';
import Settings from './settings/settings'


class Sidebar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            settingsHidden: true,
            settings : {"Mute Notifications":true, "Report a Bug":true, "Delete Data":true},
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
            return <Settings settings={this.state.settings} changeSetting={this.updateSettings.bind(this)}></Settings>
        }
    }

    updateSettings(id){
        let dict = this.state.settings;
        dict[id] = !dict[id]
        this.setState({settings : dict})
    }
    render(){
        let settingText = this.state.settingsHidden ? "Settings" : "Exit";

        return (<div className="Sidebar">
                <div className="SidebarUserProfile">
                    <div className="SidebarUserImage"></div>
                    <p className="SidebarUserInfo">user@email.com</p>
                </div>
                <input className="TopicSearch"></input>
                {this.currentWindow(this.state.settingsHidden)}
                <button className="SettingsButton" onClick={this.swapMenus}>{settingText}</button>
                
            </div>);
    }
}

export default Sidebar;