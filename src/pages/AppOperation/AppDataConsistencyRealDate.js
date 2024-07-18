import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import DataConsistencyRealDate from '../EmergencyTodoList/DataConsistencyRealDate';

export default class AppDataConsistencyRealDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <MapInteractionCSS>
                <DataConsistencyRealDate {...match.params} appStyle={{overflowY:'hidden'}} scrolly="none"/>
            </MapInteractionCSS>
        );
    }
}