import React from 'react';

class Topic extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (<div className="Topic"><p>{this.props.name}</p></div>);
    }
}

export default Topic;