import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import YsyShowVideo from '@/components/ysyvideo/YsyShowVideo'

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
                <BreadcrumbWrapper>
                 <YsyShowVideo DGIMN={this.state.dgimn} />
                </BreadcrumbWrapper>
                <NavigationTree onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />
            </div>
        );
    }
}
export default Index;
