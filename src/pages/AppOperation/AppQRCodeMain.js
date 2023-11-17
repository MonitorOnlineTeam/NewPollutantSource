import React, { Component } from 'react';
import AppQRCodeComponent from '../EmergencyTodoList/AppQRCodeComponent';

export default class AppQRCodeMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
                <AppQRCodeComponent {...match.params}  scrolly="none"/>
        );
    }
}