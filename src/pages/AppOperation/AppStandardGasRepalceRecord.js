import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import StandardGasRepalceRecordContent from '../EmergencyTodoList/StandardGasRepalceRecordContent';

export default class AppStandardGasRepalceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <MapInteractionCSS>
                <StandardGasRepalceRecordContent {...match.params} appStyle={{overflowY:'hidden'}} scrolly="none" />
            </MapInteractionCSS>
        );
    }
}