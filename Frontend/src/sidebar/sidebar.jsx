import React from 'react';

import Menu from './menu/menu';
import Login from './../auth/login';

class Sidebar extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (<div className="Sidebar">
                <div className="SidebarUserProfile">
                    <div className="SidebarUserImage"></div>
                </div><br/>
                <Login className="SidebarUserInfo"/><br/>
                <input className="TopicSearch"></input>
                <Menu></Menu>
                <button className="SettingsButton">Settings</button>
            </div>);
    }
}

export default Sidebar;