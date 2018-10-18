import React from 'react';

import Menu from './menu/menu';
class Sidebar extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (<div className="Sidebar">
                <div className="SidebarUserProfile">
                    <div className="SidebarUserImage"></div>
                    <p className="SidebarUserInfo">user@email.com</p>
                </div>
                <input className="TopicSearch"></input>
                <Menu></Menu>
                <button className="SettingsButton">Settings</button>
            </div>);
    }
}

export default Sidebar;