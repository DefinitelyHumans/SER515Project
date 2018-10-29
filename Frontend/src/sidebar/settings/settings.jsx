import React from 'react';

class Settings extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            Setting1 : true,
            Setting2 : true,
            Setting3 : true,
        }
        this.setting1 = this.setting1.bind(this)
        this.setting2 = this.setting2.bind(this)
        this.setting3 = this.setting3.bind(this)
    }

    setting1(){
        this.setState({setting1 : !this.state.setting1})
    }

    setting2(){
        this.setState({setting2 : !this.state.setting2})
    }

    setting3(){
        this.setState({setting3 : !this.state.setting3})
    }

    render(){
        return (<div className="Settings">
                    Settings:
                    <div>
                        <button className="Pin" onClick={this.setting1}/>
                        <button className="SettingsOption" onClick={this.setting1} style={{float: "right"}}>Setting 1</button>
                    </div>
                    <div>
                        <button className="Pin" onClick={this.setting2}/>
                        <button className="SettingsOption" onClick={this.setting2} style={{float: "right"}}>Setting 2</button>
                    </div>
                    <div>
                        <button className="Pin" onClick={this.setting3}/>
                        <button className="SettingsOption" onClick={this.setting3} style={{float: "right"}}>Setting 3</button>
                    </div>
                </div>);
    }
}

export default Settings;