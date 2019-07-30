import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '../../../../components/NavigationTree'
import YsyShowVideo from './YsyShowVideo'

/**
 * 视频预览
 * xpy 2019.07.26
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
        };
    }

    changeDgimn=dgimn => {
        this.setState({
            dgimn,
        })
    }

    render() {
        return (
            <div id="ysyvideo">
                <PageHeaderWrapper>
                 <YsyShowVideo DGIMN={this.state.dgimn} />
                </PageHeaderWrapper>
                <NavigationTree domId="#ysyvideo" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
