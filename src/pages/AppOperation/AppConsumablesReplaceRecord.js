import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import ConsumablesReplaceRecordContent from '../EmergencyTodoList/ConsumablesReplaceRecordContent';

export default class AppConsumablesReplaceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <MapInteractionCSS>
                <ConsumablesReplaceRecordContent {...match.params} scrolly="none"/>
            </MapInteractionCSS>
        );
    }
}