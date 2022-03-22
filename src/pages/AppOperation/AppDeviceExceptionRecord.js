import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import DeviceExceptionRecordContent from '../EmergencyTodoList/DeviceExceptionRecordContent';

export default class AppDeviceExceptionRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <MapInteractionCSS>
                <DeviceExceptionRecordContent {...match.params} appStyle={{overflowY:'hidden'}} scrolly="none" />
            </MapInteractionCSS>
        );
    }
}
