import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import CompleteExtractionRecordContent from '../EmergencyTodoList/CompleteExtractionRecordContent';

export default class AppCompleteExtractionRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <MapInteractionCSS>
                <CompleteExtractionRecordContent {...match.params}  appStyle={{overflowY:'hidden'}} scrolly="none"/>
            </MapInteractionCSS>
        );
    }
}