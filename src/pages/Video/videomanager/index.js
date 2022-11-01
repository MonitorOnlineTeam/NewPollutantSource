
import React, { Component } from 'react';
import {
    Table,
} from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import PageContent from './PageContent'
// import HkCameraIndex from '@/components/VideoView/hk/hkManagerIndex';
// import YSYManagerIndex from '@/components/VideoView/ysy';

@connect(({ loading, global }) => ({
    configInfo: global.configInfo,
}))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DGIMN: '',
            pollutantType: '',
        };
    }


    render() {
        const { pollutantType, DGIMN } = this.state;
        return (
            <>
                <NavigationTree domId="#videomanager" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.setState({
                            DGIMN: value[0].key,
                            pollutantType: value[0].Type,
                        })
                    }
                }} />
                <div id="videomanager">
                    <BreadcrumbWrapper>
                        {
                            DGIMN && <PageContent DGIMN={DGIMN} />
                        }
                    </BreadcrumbWrapper>
                </div>
            </>
        );
    }
}
export default Index;
