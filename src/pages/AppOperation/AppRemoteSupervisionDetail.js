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
            // <MapInteractionCSS> 此组件在移动端不支持onClick事件 支持onTouchEnd onTouchStart
                <div style={{overflowY:'auto',height:'100vh'}}>
                <RemoteSupervisionDetail hideBreadcrumb {...this.props} type='mobile' appStyle={{overflowY:'hidden'}} scrolly="none" />
                </div>
            //  </MapInteractionCSS>
        );
    }
}
