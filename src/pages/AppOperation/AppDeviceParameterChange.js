import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import DeviceParameterChange from '../EmergencyTodoList/DeviceParameterChange';

export default class AppBdTestRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <MapInteractionCSS>
                <DeviceParameterChange {...match.params} appStyle={{overflowY:'hidden'}} scrolly="none"/>
            </MapInteractionCSS>
        );
    }
}
