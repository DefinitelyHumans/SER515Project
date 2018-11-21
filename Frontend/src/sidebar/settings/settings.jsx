import React from 'react';
import Modal from '../../modal'

// Dialog box referenced from here: https://codepen.io/IbeVanmeenen/pen/RRpLxb

class Settings extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
        this.changeSetting = this.changeSetting.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        
    }
    showModal () {
        this.setState({visible: true});
    }
    hideModal () {
        this.setState({visible: false});
    }

    changeSetting(event){
        let id = event.target.value;
        this.props.changeSetting(id);
    }

    render(){
        let settings = Object.keys(this.props.settings);
        let buttons = settings.map((key) => {
            let status = this.props.settings[key] ? "SelectedPin" : "DeselectedPin"; 
            return (
                <div>
                        <button className={status} onClick={this.changeSetting} value={key}/>
                        <button className="SettingsOption" onClick={this.changeSetting} value={key} style={{float: "right"}}>{key}</button>
                    </div>
            )})

            let modalStatus = !this.state.visible ? "SelectedPin" : "DeselectedPin";
        return (<div className="Settings">

                        <button className={modalStatus} onClick={this.showModal}/>
                        <button className="SettingsOption" onClick={this.showModal} style={{float: "right"}}>About Corkboard</button>
                    {buttons}
                <Modal visible={this.state.visible}>
                        <h3 className="dialogTitle">
                            Hello World!
                        </h3>
                        <p className="dialogContent">
                            Welcome to CorkBoard. A Reddit/Slack clone made by Arizona State University students to practice AGILE development.
                        </p>
                        <button onClick={this.hideModal} type="button" className="closeDialogButton">Close</button>
                    </Modal>
                </div>);
    }
}

export default Settings;