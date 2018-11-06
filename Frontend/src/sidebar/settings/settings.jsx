import React from 'react';

class Settings extends React.Component {

    constructor(props){
        super(props);

        this.changeSetting = this.changeSetting.bind(this);
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

        return (<div className="Settings">
                    {buttons}
                </div>);
    }
}

export default Settings;