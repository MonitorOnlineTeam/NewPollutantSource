import React, { Component } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import RemoteSupervisionDetail from '@/pages/operations/remoteSupervision/detail';

export default class AppSparePartReplaceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <MapInteractionCSS>
                <RemoteSupervisionDetail hideBreadcrumb {...this.props} type='mobile' appStyle={{overflowY:'hidden'}} scrolly="none" />
            </MapInteractionCSS>
        );
    }
}
