import React from 'react';

class Settings extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            setting1 : false,
            setting2 : true,
            setting3 : true,
        }
        this.changeSetting1 = this.changeSetting1.bind(this)
        this.changeSetting2 = this.changeSetting2.bind(this)
        this.changeSetting3 = this.changeSetting3.bind(this)
    }

    changeSetting1(){
        this.setState({setting1 : !this.state.setting1})
    }

    changeSetting2(){
        this.setState({setting2 : !this.state.setting2})
    }

    changeSetting3(){
        this.setState({setting3 : !this.state.setting3})
    }

    render(){
        let button1Status = this.state.setting1 ? "SelectedPin" : "DeselectedPin";
        let button2Status = this.state.setting2 ? "SelectedPin" : "DeselectedPin";
        let button3Status = this.state.setting3 ? "SelectedPin" : "DeselectedPin";

        return (<div className="Settings">
                    <div>
                        <button className={button1Status} onClick={this.changeSetting1}/>
                        <button className="SettingsOption" onClick={this.changeSetting1} style={{float: "right"}}>Setting 1</button>
                    </div>
                    <div>
                        <button className={button2Status} onClick={this.changeSetting2}/>
                        <button className="SettingsOption" onClick={this.changeSetting2} style={{float: "right"}}>Setting 2</button>
                    </div>
                    <div>
                        <button className={button3Status} onClick={this.changeSetting3}/>
                        <button className="SettingsOption" onClick={this.changeSetting3} style={{float: "right"}}>Setting 3</button>
                    </div>
                </div>);
    }
}

export default Settings;