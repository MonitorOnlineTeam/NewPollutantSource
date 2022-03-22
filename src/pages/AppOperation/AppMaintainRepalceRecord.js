import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import MaintainRepalceRecordContent from '../EmergencyTodoList/MaintainRepalceRecord';

export default class AppMaintainRepalceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <MapInteractionCSS>
                <MaintainRepalceRecordContent {...match.params} appStyle={{overflowY:'hidden'}} scrolly="none"  />
            </MapInteractionCSS>
        );
    }
}
