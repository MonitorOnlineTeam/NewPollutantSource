import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import ThirdPartyTestingContent from '../EmergencyTodoList/ThirdPartyTestingContent';

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
                <ThirdPartyTestingContent {...match.params} appStyle={{overflowY:'hidden'}} scrolly="none" />
            </MapInteractionCSS>
        );
    }
}