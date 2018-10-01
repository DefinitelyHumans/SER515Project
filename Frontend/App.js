import * as React from 'react';
import * as ReactDOM from 'react-dom';

const REACT_VERSION = React.version;

ReactDOM.render(
<h4>We are using React: {REACT_VERSION}</h4>,
document.getElementById('root')
);