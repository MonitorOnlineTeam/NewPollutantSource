import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import SparePartReplaceRecordContent from '../EmergencyTodoList/SparePartReplaceRecordContent';

export default class AppSparePartReplaceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <MapInteractionCSS>
                <SparePartReplaceRecordContent {...match.params} appStyle={{overflowY:'hidden'}} scrolly="none" />
            </MapInteractionCSS>
        );
    }
}
