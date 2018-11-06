import React from 'react';

import Menu from './menu/menu';
import Settings from './settings/settings'
import Modal from './modal'

// Dialog box referenced from here: https://codepen.io/IbeVanmeenen/pen/RRpLxb

class Sidebar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            settingsHidden: true,
            settings : {"About Corkboard": false, "Mute Notifications":true, "Report a Bug":true, "Delete Data":true},
            visible: false

        }
        this.swapMenus = this.swapMenus.bind(this);
            this.showModal = this.showModal.bind(this);
            this.hideModal = this.hideModal.bind(this);
        }
        showModal () {
            this.setState({visible: true});
        }
        hideModal () {
            this.setState({visible: false});
        }

    renderSettingsOptions(){
        if (this.state.settings["About Corkboard"])
            return <dialog></dialog>
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
                <button type="button" onClick={this.showModal} className="btn"></button>
                <Modal visible={this.state.visible}>
                        <h3 className="dialog__title">
                            Hello World
                        </h3>
                        <p className="dialog__txt">
                            Nam condimentum quam varius convallis iaculis. Nulla facilisi. Maecenas pretium erat commodo, rhoncus quam quis, laoreet ante. Nunc egestas sapien et magna malesuada faucibus.
                        </p>
                        <button onClick={this.hideModal} type="button" className="btn btn--close dialog__btn">
                            Close
                        </button>
                    </Modal>
            </div>);
    }
}

export default Sidebar;