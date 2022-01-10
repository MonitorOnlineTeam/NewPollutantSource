import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import DataConsistencyRealDate from '../EmergencyTodoList/CooperaInspection';

export default class AppCooperaInspection extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <MapInteractionCSS>
                <CooperaInspection {...match.params} appStyle={{overflowY:'hidden'}} scrolly="none"/>
            </MapInteractionCSS>
        );
    }
}