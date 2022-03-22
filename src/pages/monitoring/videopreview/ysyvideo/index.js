import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '../../../../components/NavigationTree'
import YsyShowVideo from '../../../../components/ysyvideo/YsyShowVideo'

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
                <NavigationTree runState='1' domId="#ysyvideo" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
