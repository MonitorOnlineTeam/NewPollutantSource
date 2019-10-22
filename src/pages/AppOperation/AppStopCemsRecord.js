import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import StopCemsRecordContent from '../EmergencyTodoList/StopCemsRecordContent';

export default class AppStopCemsRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <MapInteractionCSS>
                <StopCemsRecordContent {...match.params} scrolly="none" />
            </MapInteractionCSS>
        );
    }
}