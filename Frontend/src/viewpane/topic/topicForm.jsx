import React from 'react';
import ReactDOM from 'react-dom';
require('react-bootstrap');
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap/lib/';

class TopicForm extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: ''
        };
    }

    getValidationState() {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    render() {
        return (
            <form>
                <FormGroup
                    controlId="formControlTitle"
                    validationState={this.getValidationState()}
                >
                    <ControlLabel>Topic Title</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="Enter Title"
                        onChange={this.handleChange}
                    />
                    <FormControl.Feedback />
                    {/* <HelpBlock>Validation is based on string length.</HelpBlock> */}
                </FormGroup>
                <FormGroup
                controlId="formControlContent">
                    <ControlLabel>Topic Content</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="Enter Content"
                        onChange={this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>

            </form>
        );
    }
}

export default TopicForm;